[findBIN]
select * from business where bin = $P{bin}


[findUnpaidAppByBIN]
select 
	a.objid, a.appno, a.appyear, a.txndate, 
	sum(r.amount - r.amtpaid) as balance 
from business b 
	inner join business_application a on a.business_objid = b.objid 
	inner join business_receivable r on r.applicationid = a.objid 
where b.bin = $P{bin} 
	and a.state in ('PAYMENT','RELEASE','COMPLETED') 
group by a.objid, a.appno, a.appyear, a.txndate 
having sum(r.amount - r.amtpaid) > 0 
order by a.appyear, a.txndate


[getLobsWithPSIC]
select 
	sc.code as objid, sc.code, sc.description as name, 
	(case 
		when sc.details is not null then sc.details 
		else c.details 
	end) as details, 
	c.code as classification_code, 
	c.description as classification_name, 
	c.details as classification_details, 

	lob.objid as lob_objid, lob.name as lob_name, 
	lob.classification_objid as lob_classification_objid
from lob 
	inner join psic_subclass sc on sc.code = lob.psicid 
	inner join psic_class c on c.code = sc.classid
order by sc.description, lob.name 


[findBusinessApp]
select a.*, 
	oa.approvedappno, oa.contact_name, 
	oa.contact_email, oa.contact_mobileno, oa.partnername
from business_application a 
	inner join business b on b.objid = a.business_objid 
	inner join online_business_application oa on oa.objid = a.objid 
where a.objid = $P{objid} 
