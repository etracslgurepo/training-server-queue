[getReportData]
select x2.*, 
  (case when x2.qtyending = 0 then 1 else 0 end) as consumed, 
  (case 
    when x2.saled = 1 then 'SALE' 
    when x2.qtyending = 0 then 'CONSUMED'
  end) as remarks,
  
  af.formtype as aftype, afc.afid as formno, af.formtype, af.denomination, af.serieslength, 
  afc.dtfiled, afc.prefix, afc.suffix, afc.stubno as startstub, afc.stubno as endstub, 
  afc.startseries, (afc.endseries + 1) as nextseries, afc.startseries as sortseries, 
  1 as ownerlevel, 'COLLECTOR' as ownertype, x2.issuedto_objid as ownerid, 

  (select issuedto_name from af_control_detail 
    where controlid = x2.controlid and refdate < $P{enddate} and issuedto_objid = x2.issuedto_objid 
      order by refdate, txndate, indexno limit 1 ) as ownername 

from ( 
  select x1.*, 
    (case 
      when x1.issuedendseries >= x1.endseries then null 
      when x1.issuedendseries < x1.endseries then (x1.issuedendseries + 1) 
      when x1.receivedstartseries > 0 then x1.receivedstartseries 
      when x1.beginstartseries > 0 then x1.beginstartseries     
    end) as endingstartseries, 
    (case 
      when x1.issuedendseries >= x1.endseries then null 
      when x1.issuedendseries < x1.endseries then x1.endseries 
      when x1.receivedstartseries > 0 then x1.receivedendseries 
      when x1.beginstartseries > 0 then x1.beginendseries     
    end) as endingendseries, 
    (case 
      when x1.issuedendseries >= x1.endseries then 0  
      when x1.issuedendseries < x1.endseries then (x1.endseries - x1.issuedendseries) 
      when x1.receivedstartseries > 0 then x1.qtyreceived 
      when x1.beginstartseries > 0 then x1.qtybegin 
      else 0 
    end) as qtyending 
  from ( 
    select 
      x0.controlid, x0.afid, x0.endseries, x0.issuedto_objid, x0.saled, 
      min(x0.receivedstartseries) as receivedstartseries, 
      min(x0.receivedendseries) as receivedendseries, 
      (case 
        when min(x0.receivedstartseries) > 0 then 
          min(x0.receivedendseries) - min(x0.receivedstartseries) + 1 
        else 0
      end) as qtyreceived, 
      (case 
        when min(x0.receivedstartseries) > 0 then null 
        else min(x0.beginstartseries) 
      end) as beginstartseries, 
      (case 
        when min(x0.receivedstartseries) > 0 then null 
        else min(x0.beginendseries) 
      end) as beginendseries, 
      (case 
        when min(x0.receivedstartseries) > 0 then 0 
        when min(x0.beginstartseries) > 0 then 
          min(x0.beginendseries) - min(x0.beginstartseries) + 1 
        else 0
      end) as qtybegin, 
      min(x0.issuedstartseries) as issuedstartseries, 
      max(x0.issuedendseries) as issuedendseries,  
      (case 
        when min(x0.issuedstartseries) > 0 then 
          max(x0.issuedendseries) - min(x0.issuedstartseries) + 1 
        else 0
      end) as qtyissued  
    from ( 
      select 
        t2.controlid, t2.afid, t2.endseries, t2.issuedto_objid, 0 as saled,  
        null as receivedstartseries, null as receivedendseries, 
        pd.endingstartseries as beginstartseries, pd.endingendseries as beginendseries, 
        null as issuedstartseries, null as issuedendseries 
      from ( 
        select t1.* 
        from ( 
          select t0.*,
            (select qtyending from af_control_detail 
              where controlid = t0.controlid and refdate < $P{startdate} and issuedto_objid = t0.issuedto_objid 
                order by refdate desc, txndate desc, indexno desc limit 1) as qtybalance, 
            (select objid from af_control_detail 
              where controlid = t0.controlid and refdate < $P{startdate} and issuedto_objid = t0.issuedto_objid 
                order by refdate desc, txndate desc, indexno desc limit 1) as detailid, 
            (select objid from af_control_detail 
              where controlid = t0.controlid and refdate < $P{startdate} 
                order by refdate desc, txndate desc, indexno desc limit 1) as lastdetailid  
          from (
            select afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid 
            from af_control_detail afd 
              inner join af_control afc on afc.objid = afd.controlid 
            where afd.refdate < $P{startdate} 
              and afd.issuedto_objid = $P{collectorid} 
            group by afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid 
          )t0 
        )t1 
        where t1.qtybalance > 0 
      )t2 
        inner join af_control_detail pd on pd.objid = t2.detailid 
        inner join af_control_detail ld on ld.objid = t2.lastdetailid 
      where 1=1 
        and (case 
          when ld.reftype = 'RETURN' then 0 
          when ld.issuedto_objid <> t2.issuedto_objid then 0 
          else 1 
        end) = 1 

      union all 

      select
        t2.controlid, t2.afid, t2.endseries, t2.issuedto_objid, t2.saled, 
        t2.receivedstartseries, t2.receivedendseries, 
        t2.beginstartseries, t2.beginendseries, 
        null as issuedstartseries, null as issuedendseries 
      from ( 
        select t1.*, 
          (case 
            when fd.reftype in ('ISSUE','MANUAL_ISSUE') and fd.txntype = 'SALE' 
              then 1 else 0 
          end) as saled, 
          (case 
            when fd.reftype = 'TRANSFER' then fd.endingstartseries 
            when fd.reftype in ('ISSUE','MANUAL_ISSUE') then fd.receivedstartseries 
          end) as receivedstartseries,
          (case 
            when fd.reftype = 'TRANSFER' then fd.endingendseries 
            when fd.reftype in ('ISSUE','MANUAL_ISSUE') then fd.receivedendseries 
          end) as receivedendseries,
          (case 
            when fd.reftype = 'FORWARD' then fd.endingstartseries 
            when fd.reftype = 'REMITTANCE' then fd.issuedstartseries 
          end) as beginstartseries,
          (case 
            when fd.reftype = 'FORWARD' then fd.endingendseries 
            when fd.reftype = 'REMITTANCE' then t1.endseries 
          end) as beginendseries,

          (select objid from af_control_detail 
            where controlid = t1.controlid and issuedto_objid = t1.issuedto_objid 
                and refdate >= $P{startdate} and refdate < $P{enddate} and qtyissued > 0 
              order by refdate, txndate, indexno limit 1) as firstissuanceid, 

          (select objid from af_control_detail 
            where controlid = t1.controlid and refdate < $P{enddate} 
              order by refdate desc, txndate desc, indexno desc limit 1) as lastdetailid 
        from ( 
          select t0.*,
            (select objid from af_control_detail 
              where controlid = t0.controlid and issuedto_objid = t0.issuedto_objid 
                  and refdate >= $P{startdate} and refdate < $P{enddate} 
                order by refdate, txndate, indexno limit 1) as firstdetailid 
          from ( 
            select afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid 
            from af_control_detail afd 
              inner join af_control afc on afc.objid = afd.controlid 
            where afd.refdate >= $P{startdate} 
              and afd.refdate < $P{enddate} 
              and afd.issuedto_objid = $P{collectorid} 
            group by afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid 
          )t0 
        )t1, af_control_detail fd 
        where fd.objid = t1.firstdetailid 
      )t2, af_control_detail ld 
      where ld.objid = t2.lastdetailid 
        and (case 
            when t2.firstissuanceid is not null then 1 
            when ld.issuedto_objid = t2.issuedto_objid then 1 else 0 
          end) = 1 

      union all 

      select 
        t1.controlid, t1.afid, t1.endseries, t1.issuedto_objid, 0 as saled, 
        null as receivedstartseries, null as receivedendseries, 
        t1.issuedstartseries as beginstartseries, t1.endseries as beginendseries, 
        t1.issuedstartseries, t1.issuedendseries 
      from ( 
        select t0.*, 
          (select objid from af_control_detail 
            where controlid = t0.controlid and refdate < $P{enddate} 
              order by refdate desc, txndate desc, indexno desc limit 1) as lastdetailid  
        from ( 
          select 
            afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid, 
            min(afd.issuedstartseries) as issuedstartseries, 
            max(afd.issuedendseries) as issuedendseries 
          from af_control_detail afd 
            inner join af_control afc on afc.objid = afd.controlid 
          where afd.refdate >= $P{startdate} 
            and afd.refdate < $P{enddate} 
            and afd.issuedto_objid = $P{collectorid} 
            and afd.qtyissued > 0 
          group by afd.controlid, afc.afid, afc.endseries, afd.issuedto_objid 
        )t0 
      )t1, af_control_detail d 
      where d.objid = t1.lastdetailid 
        and (case 
            when t1.issuedstartseries > 0 then 1
            when d.issuedto_objid = t1.issuedto_objid then 1 else 0
          end) = 1 
    )x0 
    group by x0.controlid, x0.afid, x0.endseries, x0.issuedto_objid, x0.saled  
  )x1 
)x2 
  inner join af_control afc on afc.objid = x2.controlid 
  inner join af on af.objid = afc.afid 
order by 
  afc.afid, (case when x2.qtyissued > 0 then 0 else 1 end), afc.dtfiled, afc.startseries


[getReportData_bak1]
select tmp5.* 
from ( 

  select tmp4.*, 
    tmp4.ownername as name, tmp4.ownertype as respcentertype, 
    (case when tmp4.ownertype='AFO' then 1 else 2 end) as respcenterlevel, 
    (case when tmp4.qtyissued > 0 then 0 else 1 end) as categoryindex 
    
  from ( 

    select 
      tmp3.controlid, tmp3.minrefdate, tmp3.maxrefdate, tmp3.iflag, 
      afc.afid, af.formtype as aftype, afc.afid as formno, af.formtype, af.denomination, af.serieslength, 
      afc.dtfiled, afc.prefix, afc.suffix, afc.stubno as startstub, afc.stubno as endstub, 
      afc.startseries, afc.endseries, afc.endseries+1 as nextseries, afc.startseries as sortseries, 
      (case when afd.issuedto_objid is null then 0 else 1 end) as ownerlevel, 
      (case when afd.issuedto_objid is null then 'AFO' else 'COLLECTOR' end) as ownertype, 
      (case when afd.issuedto_objid is null then 'AFO' else afd.issuedto_objid end) as ownerid, 
      (case when afd.issuedto_objid is null then 'AFO' else afd.issuedto_name end) as ownername, 
      (case when afd.txntype = 'SALE' then 1 else 0 end) as saled, 
      tmp3.receivedstartseries, tmp3.receivedendseries, 
      case 
        when tmp3.receivedstartseries > 0 
        then (tmp3.receivedendseries-tmp3.receivedstartseries)+1 else 0
      end as qtyreceived, 
      case 
        when tmp3.issuedstartseries > 0 then tmp3.issuedstartseries 
        when tmp3.receivedstartseries > 0 then null 
        else tmp3.beginstartseries
      end as beginstartseries, 
      case 
        when tmp3.issuedstartseries > 0 then afc.endseries  
        when tmp3.receivedstartseries > 0 then null 
        else tmp3.beginendseries
      end as beginendseries, 
      case 
        when tmp3.issuedstartseries > 0 then (afc.endseries-tmp3.issuedstartseries)+1   
        when tmp3.receivedstartseries > 0 then 0 
        else (tmp3.beginendseries-tmp3.beginstartseries)+1 
      end as qtybegin, 
      tmp3.issuedstartseries, tmp3.issuedendseries, tmp3.qtyissued, 
      tmp3.endingstartseries, tmp3.endingendseries, 
      case 
        when tmp3.endingstartseries > 0 
        then (tmp3.endingendseries-tmp3.endingstartseries)+1 else 0 
      end as qtyending, 
      tmp3.consumed, 
      case 
        when afd.txntype = 'SALE' then 'SALE'  
        when tmp3.consumed > 0 then 'CONSUMED' 
        else null 
      end as remarks 
    from ( 

      select tmp2.*, (
          select objid from af_control_detail 
          where controlid = tmp2.controlid 
            and refdate = tmp2.maxrefdate 
            and issuedto_objid = tmp2.issuedto_objid 
          order by refdate desc, txndate desc limit 1 
        ) as detailid 
      from ( 

        select 
          tmp1.controlid, min(tmp1.refdate) as minrefdate, max(tmp1.refdate) as maxrefdate, tmp1.issuedto_objid, 
          min(tmp1.receivedstartseries) as receivedstartseries, min(tmp1.receivedendseries) as receivedendseries, 
          min(tmp1.beginstartseries) as beginstartseries, min(tmp1.beginendseries) as beginendseries, 
          min(tmp1.issuedstartseries) as issuedstartseries, max(tmp1.issuedendseries) as issuedendseries, 
          sum(tmp1.qtyissued) as qtyissued, max(tmp1.iflag) as iflag, 
          case 
            when max(tmp1.issuedendseries) >= tmp1.endseries then null 
            when max(tmp1.issuedendseries) < tmp1.endseries then max(tmp1.issuedendseries)+1 
            when min(tmp1.beginstartseries) > 0 then min(tmp1.beginstartseries) 
            else min(tmp1.receivedstartseries) 
          end as endingstartseries, 
          case 
            when max(tmp1.issuedendseries) >= tmp1.endseries then null 
            else tmp1.endseries 
          end as endingendseries, 
          case 
            when max(tmp1.issuedendseries) >= tmp1.endseries then 1 else 0 
          end as consumed  
        from ( 

          select 
            afd.controlid, afd.refdate, t2.endseries, t2.issuedto_objid, 
            null as receivedstartseries, null as receivedendseries, 
            afd.endingstartseries as beginstartseries, afd.endingendseries as beginendseries, 
            null as issuedstartseries, null as issuedendseries, 0 as qtyissued, 1 as iflag 
          from ( 
            select t1.*, 
              (
                select objid from af_control_detail 
                where controlid = t1.controlid and refdate = t1.refdate 
                order by txndate desc, indexno desc limit 1 
              ) as detailid 
            from ( 
              select afd.controlid, afc.endseries, afd.issuedto_objid, max(afd.refdate) as refdate 
              from af_control_detail afd 
                inner join af_control afc on afc.objid = afd.controlid 
              where afd.refdate < $P{startdate} 
                and afd.issuedto_objid = $P{collectorid} 
              group by afd.controlid, afc.endseries, afd.issuedto_objid  
            )t1 
          )t2
            inner join af_control_detail afd on afd.objid = t2.detailid 
          where afd.issuedto_objid = t2.issuedto_objid 
            and afd.qtyending > 0 
          
          union all 

          select 
            afd.controlid, max(afd.refdate) as refdate, afc.endseries, afd.issuedto_objid, 
            min(case when afd.receivedstartseries > 0 then afd.receivedstartseries else null end) as receivedstartseries, 
            min(case when afd.receivedendseries > 0 then afd.receivedendseries else null end) as receivedendseries, 
            min(case when afd.beginstartseries > 0 then afd.beginstartseries else null end) as beginstartseries, 
            min(case when afd.beginendseries > 0 then afd.beginendseries else null end) as beginendseries, 
            min(case when afd.issuedstartseries > 0 then afd.issuedstartseries else null end) as issuedstartseries, 
            max(case when afd.issuedendseries > 0 then afd.issuedendseries else null end) as issuedendseries, 
            sum(afd.qtyissued) as qtyissued, 2 as iflag  
          from af_control_detail afd, af_control afc  
          where afd.refdate >= $P{startdate} 
            and afd.refdate <  $P{enddate}  
            and afd.issuedto_objid = $P{collectorid} 
            and afc.objid = afd.controlid 
          group by afd.controlid, afc.endseries, afd.issuedto_objid 

        )tmp1 
        group by tmp1.controlid, tmp1.endseries, tmp1.issuedto_objid   

      )tmp2

    )tmp3, af_control_detail afd, af_control afc, af  
    where afd.objid = tmp3.detailid 
      and afc.objid = afd.controlid 
      and af.objid = afc.afid 

  )tmp4
)tmp5
order by tmp5.afid, tmp5.respcenterlevel, tmp5.categoryindex, tmp5.dtfiled, tmp5.startseries 


[getReportDataByRef]
select * from ( 
  select 
    'A' as idx, '' as type, t2.controlid, af.formtype, afi.afid as formno, af.denomination, af.serieslength, 
    afi.respcenter_objid as ownerid, afi.respcenter_name as name, afi.respcenter_type as respcentertype, 
    (case when afi.respcenter_type='AFO' then 0 else 1 end) as categoryindex, afi.startstub, afi.endstub, 
    t2.prevendingstartseries, t2.prevendingendseries, 
    t2.receivedstartseries, t2.receivedendseries, 
    (case when t2.beginstartseries>0 and t2.prevendingstartseries>0 then t2.prevendingstartseries else t2.beginstartseries end) as beginstartseries, 
    (case when t2.beginendseries>0 and t2.prevendingendseries>0 then t2.prevendingendseries else t2.beginendseries end) as beginendseries, 
    t2.issuedstartseries, t2.issuedendseries, t2.issuednextseries, 
    (case when t2.issuednextseries>t2.endingendseries then null else t2.endingstartseries end) as endingstartseries, 
    (case when t2.issuednextseries>t2.endingendseries then null else t2.endingendseries end) as endingendseries, 
    case 
      when t2.beginstartseries > 0 then t2.beginstartseries 
      when t2.issuedstartseries > 0 then t2.issuedstartseries 
      when t2.receivedstartseries > 0 then t2.receivedstartseries 
      else t2.endingstartseries 
    end as sortseries, 
    afi.afid, t2.qtycancelled 
  from ( 
    select t1.*, 
      (
        select max(endingstartseries) from af_inventory_detail 
        where controlid=t1.controlid and lineno < t1.minlineno 
      ) as prevendingstartseries, 
      (
        select max(endingendseries) from af_inventory_detail 
        where controlid=t1.controlid and lineno < t1.minlineno 
      ) as prevendingendseries  
    from ( 
      select 
        afd.controlid, min(afd.lineno) as minlineno, max(afd.lineno) as maxlineno,   
        min(afd.receivedstartseries) as receivedstartseries, 
        max(afd.receivedendseries) as receivedendseries, 
        min(afd.beginstartseries) as beginstartseries, 
        max(afd.beginendseries) as beginendseries, 
        min(afd.issuedstartseries) as issuedstartseries, 
        max(afd.issuedendseries) as issuedendseries, 
        max(afd.issuedendseries)+1 as issuednextseries, 
        max(afd.endingstartseries) as endingstartseries, 
        max(afd.endingendseries) as endingendseries, 
        sum(afd.qtycancelled) as qtycancelled  
      from remittance_af raf 
        inner join af_inventory_detail afd on raf.objid=afd.objid 
      where raf.remittanceid = $P{refid} 
      group by afd.controlid 
      union 
      select 
        afd.controlid, min(afd.lineno) as minlineno, max(afd.lineno) as maxlineno,   
        min(afd.receivedstartseries) as receivedstartseries, 
        max(afd.receivedendseries) as receivedendseries, 
        min(afd.beginstartseries) as beginstartseries, 
        max(afd.beginendseries) as beginendseries, 
        min(afd.issuedstartseries) as issuedstartseries, 
        max(afd.issuedendseries) as issuedendseries, 
        max(afd.issuedendseries)+1 as issuednextseries, 
        max(afd.endingstartseries) as endingstartseries, 
        max(afd.endingendseries) as endingendseries, 
        sum(afd.qtycancelled) as qtycancelled 
      from liquidation_remittance lr 
        inner join remittance_af raf on lr.objid = raf.remittanceid 
        inner join af_inventory_detail afd on raf.objid=afd.objid 
      where lr.liquidationid = $P{refid}     
      group by afd.controlid 
    )t1  
  )t2 
    inner join af_inventory afi on t2.controlid=afi.objid 
    inner join af on afi.afid = af.objid 
)t3 
where t3.formno like $P{formno}   
order by t3.formno, t3.sortseries 


[findLastDetail]
select 
  objid, controlid, refid, reftype, refdate, 
  txndate, txntype, issuedto_objid as issuedtoid 
from af_control_detail 
where controlid = $P{controlid} 
  and refdate < $P{enddate} 
order by refdate desc, txndate desc, indexno desc
