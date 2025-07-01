[findProcessApp]
select 
	objid, state, apptype, appyear, appdate, controlno, business_objid, 
	dtapproved, approvedby_objid, approvedby_name, approvedappno, 
	contact_name, contact_address, contact_email, contact_mobileno 
from online_business_application
where objid = $P{objid} 
	and state = 'PROCESSING' 


[findBusinessApp]
select a.*, 
	oa.approvedappno, oa.contact_email, 
	oa.contact_mobileno, oa.partnername
from online_business_application oa 
	inner join business b on b.objid = oa.business_objid 
	inner join business_application a on a.objid = oa.objid 
where a.objid = $P{objid} 


[findOpenCount]
select count(*) as txncount
from online_business_application 
where state = 'OPEN' 
