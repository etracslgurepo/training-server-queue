[getCollectionTypes]
select 
	t0.formtypeindexno, t0.formno, t0.formtype, t0.controlid, 
	t0.stubno, afc.prefix, afc.suffix, afc.afunit_interval, 
	afc.af_serieslength, t0.minseries, 
	(case 
		when afc.afunit_interval > 1
			then t0.maxseries + (afc.afunit_interval - 1)
		else t0.maxseries 
	end) as maxseries, 
	t0.fromseries, t0.toseries, t0.amount 
from ( 
	select 
		c.formtypeindexno, c.formno, c.formtype, c.controlid, c.stubno, 
		min(c.series) as minseries, max(c.series) as maxseries, 
		(case when c.formtype = 'serial' then min(c.receiptno) end) as fromseries, 
		(case when c.formtype = 'serial' then max(c.receiptno) end) as toseries,
		sum(t1.amount) as amount 
	from ( 
		select c.receiptid, sum(c.amount) - sum(c.voidamount) as amount 
		from vw_remittance_cashreceipt c 
			inner join af_control afc on afc.objid = c.controlid 
		where c.remittanceid = $P{remittanceid} 
			and afc.fund_objid = $P{fundid} 
		group by c.receiptid 
		union all 
		select ci.receiptid, sum(ci.amount) as amount  
		from vw_remittance_cashreceiptitem ci  
			inner join af_control afc on (afc.objid = ci.controlid and afc.fund_objid is null) 
		where ci.remittanceid = $P{remittanceid} 
			and ci.fundid = $P{fundid} 
		group by ci.receiptid 
		union all 
		select ci.receiptid, -sum(ci.amount) as amount  
		from vw_remittance_cashreceiptshare ci  
			inner join af_control afc on (afc.objid = ci.controlid and afc.fund_objid is null) 
			inner join itemaccount ia on ia.objid = ci.refacctid 
		where ci.remittanceid = $P{remittanceid} 
			and ia.fund_objid = $P{fundid} 
		group by ci.receiptid 
		union all 
		select ci.receiptid, sum(ci.amount) as amount  
		from vw_remittance_cashreceiptshare ci  
			inner join af_control afc on (afc.objid = ci.controlid and afc.fund_objid is null) 
		where ci.remittanceid = $P{remittanceid} 
			and ci.fundid = $P{fundid} 
		group by ci.receiptid 
	)t1, vw_remittance_cashreceipt c 
	where c.receiptid = t1.receiptid 
	group by c.formtypeindexno, c.formno, c.formtype, c.controlid, c.stubno 
)t0, vw_af_control afc 
where afc.objid = t0.controlid  
order by t0.formtypeindexno, t0.formno, t0.minseries 


[getCollectionSummaries]
select 
	t1.formindex, t1.formno, t1.collectiontype_objid, t1.collectiontypetitle, 
	t1.fundid, fund.title as fundtitle, sum(t1.amount) as amount 
from ( 
	select 
		ci.formtypeindex as formindex, ci.formno, 
		ci.collectiontype_objid, ci.collectiontype_name as collectiontypetitle, 
		sum(ci.amount) as amount, ci.fundid 
	from vw_remittance_cashreceiptitem ci 
	where ci.remittanceid = $P{remittanceid} 
		and ci.fundid = $P{fundidfilter} 
	group by ci.formtypeindex, ci.formno, ci.collectiontype_objid, ci.collectiontype_name, ci.fundid 
	union all 
	select 
		ci.formtypeindex as formindex, ci.formno, 
		ci.collectiontype_objid, ci.collectiontype_name as collectiontypetitle,
		-sum(ci.amount) as amount, ia.fund_objid as fundid    
	from vw_remittance_cashreceiptshare ci 
		inner join itemaccount ia on ia.objid = ci.refacctid 
	where ci.remittanceid = $P{remittanceid} 
		and ia.fund_objid = $P{fundidfilter} 
	group by ci.formtypeindex, ci.formno, ci.collectiontype_objid, ci.collectiontype_name, ia.fund_objid  
	union all 
	select 
		ci.formtypeindex as formindex, ci.formno, 
		ci.collectiontype_objid, ci.collectiontype_name as collectiontypetitle,
		sum(ci.amount) as amount, ci.fundid 
	from vw_remittance_cashreceiptshare ci 
	where ci.remittanceid = $P{remittanceid} 
		and ci.fundid = $P{fundidfilter} 
	group by ci.formtypeindex, ci.formno, ci.collectiontype_objid, ci.collectiontype_name, ci.fundid  
)t1, fund 
where fund.objid = t1.fundid 
group by t1.formindex, t1.formno, t1.collectiontype_objid, t1.collectiontypetitle, t1.fundid, fund.title 
order by t1.formindex, t1.formno, t1.collectiontypetitle 


[getOtherPayments]
select * from ( 
	select 
		reftype, bankid, bank_name, particulars, 
		sum(amount)-sum(voidamount) as amount, 
		min(refdate) as refdate 
	from vw_remittance_cashreceiptpayment_noncash 
	where remittanceid = $P{remittanceid} 
		and fundid = $P{fundid} 
		and voided = 0 
	group by reftype, bankid, bank_name, particulars 
)t1 
where amount > 0 
order by bank_name, refdate, amount 


[getRemittedAFs]
select tmp1.* 
from ( 
	select remaf.*, 
		af.formtype, afc.afid as formno, af.serieslength, af.denomination, afc.stubno, 
		afc.prefix, afc.suffix, afc.startseries, afc.endseries, afc.endseries+1 as nextseries, 
		(case when af.formtype = 'serial' then 0 else 1 end) as formindex 
	from remittance_af remaf 
		inner join af_control afc on afc.objid = remaf.controlid 
		inner join af on af.objid = afc.afid 
	where remaf.remittanceid = $P{remittanceid} 
)tmp1
order by tmp1.formindex, tmp1.formno, tmp1.startseries 


[findDerivedRemittanceFund]
select 
	concat(r.controlno, '-', fund.code) as controlno, 
	t1.amount, t1.amount as totalcash, 0.0 as totalcheck, 
	0.0 as totalcr, null as cashbreakdown, 
	fund.objid as fund_objid,  
	fund.code as fund_code, 
	fund.title as fund_title 
from ( 

	select remittanceid, fundid, sum(amount) as amount 
	from ( 
		select ci.remittanceid, ci.fundid, sum(ci.amount) as amount
		from vw_remittance_cashreceiptitem ci 
		where ci.remittanceid = $P{remittanceid} 
			and ci.fundid = $P{fundid} 
		group by ci.remittanceid, ci.fundid 
		union all 
		select ci.remittanceid, ia.fund_objid as fundid, -sum(ci.amount) as amount     
		from vw_remittance_cashreceiptshare ci 
			inner join itemaccount ia on ia.objid = ci.refacctid 
		where ci.remittanceid = $P{remittanceid} 
			and ia.fund_objid = $P{fundid} 
		group by ci.remittanceid, ia.fund_objid  
		union all 
		select ci.remittanceid, ci.fundid, sum(ci.amount) as amount
		from vw_remittance_cashreceiptshare ci 
		where ci.remittanceid = $P{remittanceid} 
			and ci.fundid = $P{fundid} 
		group by ci.remittanceid, ci.fundid  
	)t0 
	group by remittanceid, fundid

)t1 
	inner join remittance r on r.objid = t1.remittanceid 
	inner join fund on fund.objid = t1.fundid 
order by 
	fund.groupid, fund.system desc, fund.code, fund.title 
