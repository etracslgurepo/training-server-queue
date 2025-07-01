[getReceivables]
SELECT 
   br.*, 
   r.code AS account_code, 
   br.taxfeetype AS account_taxfeetype, 
   br.amount - br.amtpaid AS balance,
   app.appno, br.iyear AS year
FROM business_receivable br 
LEFT JOIN itemaccount r ON  r.objid=br.account_objid 
LEFT JOIN business_application app ON app.objid=br.applicationid
WHERE ${filter} AND ((br.amount-br.amtpaid) > 0) 
ORDER BY br.iyear DESC, br.lob_name DESC, r.code ASC

[getAllReceivables]
select * 
from ( 
  select 
    br.*, ia.`code` as account_code, br.taxfeetype AS account_taxfeetype, 
    (case when (br.amount-br.amtpaid) > 0 then br.amount-br.amtpaid else 0.0 end) as total, 
    (case when (br.amount-br.amtpaid) > 0 then br.amount-br.amtpaid else 0.0 end) as balance, 
    app.appno, br.iyear as `year`, 
    (case 
      when br.taxfeetype = 'TAX' then 0
      when br.taxfeetype = 'REGFEE' then 1
      when br.taxfeetype = 'OTHERCHARGE' then 2 else 3 
    end) as taxfeegroupidx, 
    (case when br.lob_objid is null then 1 else 0 end) as lobgroupidx  
  from business_receivable br 
    left join itemaccount ia on ia.objid = br.account_objid 
    left join business_application app on app.objid = br.applicationid 
  where ${filter} 
)t0 
order by lobgroupidx, iyear desc, taxfeegroupidx, lob_name, account_title  

[getReceivablePayments]
select 
  bp.objid as paymentid, bp.refid, bp.refdate, 
  bp.refno, bp.reftype, sum(bi.amount) as amount
from business_payment_item bi
  inner join business_payment bp on (bp.objid = bi.parentid and bp.voided = 0)
where bi.receivableid = $P{receivableid} 
group by bp.objid, bp.refid, bp.refdate, bp.refno, bp.reftype
order by bp.refdate desc, bp.refno desc 

[getAssessmentTaxFees]
select t0.* 
from (
   select 
    br.*, ia.`code` AS account_code, br.objid AS receivableid, 
      (
         select assessmenttype from business_application_lob 
         where applicationid = br.applicationid 
            and lobid = br.lob_objid 
         limit 1 
      ) as lob_assessmenttype, 
      (case 
        when br.taxfeetype = 'TAX' then 'Business Tax'
        when br.taxfeetype = 'REGFEE' then 'Regulatory Fee'
        when br.taxfeetype = 'OTHERCHARGE' then 'Other Charge' 
        else 'Others'
      end) as taxfeetypename, 
      (case 
         WHEN (br.taxfeetype='TAX' AND NOT(br.lob_objid IS NULL) ) THEN 0
         WHEN (br.taxfeetype='TAX' AND br.lob_objid IS NULL ) THEN 1
         WHEN (br.taxfeetype='REGFEE' AND NOT(br.lob_objid IS NULL) ) THEN 2
         WHEN (br.taxfeetype='REGFEE' AND br.lob_objid IS NULL ) THEN 3
         ELSE 4
      end) AS sortorder, 
      (case when (br.amount-br.amtpaid) > 0 then (br.amount-br.amtpaid) else 0.0 end) as amtdue, 
      br.iyear AS `year`, 
      (case 
         when br.taxfeetype = 'TAX' then 0
         when br.taxfeetype = 'REGFEE' then 1
         when br.taxfeetype = 'OTHERCHARGE' then 2 else 3 
      end) as taxfeegroupidx, 
      (case when br.lob_objid is null then 1 else 0 end) as lobgroupidx  
   from business_receivable br 
      inner join business_application ba on ba.objid = br.applicationid 
      inner join business b on b.objid = ba.business_objid 
      left join itemaccount ia on ia.objid = br.account_objid 
   where ${filter} 
)t0 
order by taxfeegroupidx, iyear, lobgroupidx, lob_name, account_title  


#########################################
# used by BusinessCashReceiptService
#########################################
[getBilling]
select t0.* 
from ( 
   select 
      br.*, ba.apptype, ba.appno, ba.appyear, br.objid AS receivableid, 
      (
         select assessmenttype from business_application_lob 
         where applicationid = br.applicationid 
            and lobid = br.lob_objid 
         limit 1 
      ) as lob_assessmenttype, 
      ia.`code` AS account_code, 
      (case 
         when br.taxfeetype = 'TAX' then 'Business Tax'
         when br.taxfeetype = 'REGFEE' then 'Regulatory Fee'
         when br.taxfeetype = 'OTHERCHARGE' then 'Other Charge' 
         else 'Others'
      end) as taxfeetypename, 
      (case 
         WHEN (br.taxfeetype='TAX' AND NOT(br.lob_objid IS NULL) ) THEN 0
         WHEN (br.taxfeetype='TAX' AND br.lob_objid IS NULL ) THEN 1
         WHEN (br.taxfeetype='REGFEE' AND NOT(br.lob_objid IS NULL) ) THEN 2
         WHEN (br.taxfeetype='REGFEE' AND br.lob_objid IS NULL ) THEN 3
         ELSE 4
      end) AS sortorder, 
      br.iyear AS `year`, 
      (case 
         when br.taxfeetype = 'TAX' then 0
         when br.taxfeetype = 'REGFEE' then 1
         when br.taxfeetype = 'OTHERCHARGE' then 2 else 3 
      end) as taxfeegroupidx, 
      (case when br.lob_objid is null then 1 else 0 end) as lobgroupidx       
   from business_receivable br
      inner join business_application ba on ba.objid = br.applicationid 
      inner join business b on b.objid = ba.business_objid 
      left join itemaccount ia on ia.objid = br.account_objid 
   where ${filter} 
      and (br.amount - br.amtpaid) > 0 
)t0 
order by taxfeegroupidx, iyear, lobgroupidx, lob_name, account_title

[removeReceivables]
DELETE FROM business_receivable WHERE applicationid=$P{applicationid}

[removeDetails]
DELETE FROM business_receivable_detail WHERE receivableid IN ( 
  SELECT objid FROM business_receivable 
  WHERE applicationid=$P{applicationid} 
)

[getDetails]
SELECT * 
FROM business_receivable_detail 
WHERE receivableid IN ( 
    SELECT objid FROM business_receivable 
    WHERE applicationid=$P{applicationid} 
) 

[findHasPaidReceivable]
select count(*) as counter  
from ( 
  select r.objid, r.applicationid, 
    (
      select distinct 1 
      from business_payment p 
        inner join business_payment_item bpi on bpi.parentid = p.objid 
      where p.applicationid = r.applicationid 
        and bpi.receivableid = r.objid 
        and p.voided = 0 
    ) as paid  
  from business_receivable r 
  where r.applicationid = $P{applicationid} 
    and r.amtpaid > 0
)t1  
where t1.paid is not null 

[updateReceivable]
UPDATE business_receivable SET amtpaid = amtpaid + $P{amount} WHERE objid = $P{receivableid}

[updateTaxCredit]
UPDATE business_receivable
SET taxcredit = taxcredit + $P{taxcredit} 
WHERE objid = $P{receivableid}

[getOpenReceivablesByBusinessX]
SELECT br.applicationid, br.iyear AS appyear, br.businessid, ba.appno,
CASE WHEN ba.objid IS NULL THEN b.apptype ELSE ba.apptype END AS apptype,
SUM( amount - amtpaid ) AS balance, b.businessname, b.address_text
FROM business_receivable br
LEFT JOIN business_application ba ON ba.objid=br.applicationid
INNER JOIN business b ON b.objid=br.businessid
WHERE ${filter} 
AND (br.amount-br.amtpaid) > 0
GROUP BY br.applicationid, br.iyear

[getOpenReceivablesByOwner]
SELECT 
  applicationid, appyear, businessid, appno, apptype, 
  sum( balance ) as balance, businessname, address_text 
FROM ( 
  SELECT 
    br.applicationid, br.iyear AS appyear, b.objid AS businessid, ba.appno,
    CASE WHEN ba.objid IS NULL THEN b.apptype ELSE ba.apptype END AS apptype,
    ( amount - amtpaid ) AS balance, b.businessname, b.address_text 
  FROM business_receivable br 
    INNER JOIN business b ON b.objid=br.businessid
    LEFT JOIN business_application ba ON ba.objid=br.applicationid
  WHERE b.owner_objid = $P{ownerid} 
    AND (br.amount-br.amtpaid) > 0  
)xx 
GROUP BY 
  applicationid, appyear, businessid, appno, 
  apptype, businessname, address_text   

[getBusinessListForBilling]
select 
  a.objid, a.address_text, a.businessname, a.tradename, 
  a.owner_objid, a.owner_name, a.owner_address_text, a.bin, 
  xx.balance 
from ( 
  select br.businessid, sum(br.amount-br.amtpaid) as balance 
  from business b 
    inner join business_application a on b.objid = a.business_objid 
    inner join business_receivable br on a.objid = br.applicationid 
  where 1=1 ${filter} 
    and a.state in ('PAYMENT','RELEASE','COMPLETED') 
  group by br.businessid 
  having sum(br.amount-br.amtpaid) > 0 
)xx 
  inner join business a on xx.businessid = a.objid 
order by owner_name 

[getAppListForBilling]
select 
    a.objid AS applicationid, b.objid AS businessid, b.address_text,
    b.businessname, b.tradename, b.owner_objid, b.owner_name, 
    b.owner_address_text, b.bin, a.appno, a.apptype, 
    a.state AS appstate, a.appyear, xx.balance 
from ( 
  select 
      b.objid as businessid, a.objid as applicationid, 
      sum(br.amount-br.amtpaid) as balance 
    from business b 
      inner join business_application a on b.objid = a.business_objid 
      inner join business_receivable br on a.objid = br.applicationid 
    where b.objid = $P{businessid} 
      and a.state in ('PAYMENT','RELEASE','COMPLETED') 
      and a.apptype IN ('NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB') 
    group by b.objid, a.objid 
    having sum(br.amount-br.amtpaid) > 0 
)xx inner join business_application a on xx.applicationid = a.objid 
  inner join business b on a.business_objid = b.objid 


[findUnpaidBalance]
select (sum(r.amount) - sum(r.amtpaid)) as balance 
from business b, business_application a, business_receivable r 
where b.objid = $P{businessid} 
  and a.business_objid = b.objid 
  and r.applicationid = a.objid 
  and a.state in ('PAYMENT','RELEASE','COMPLETED') 
