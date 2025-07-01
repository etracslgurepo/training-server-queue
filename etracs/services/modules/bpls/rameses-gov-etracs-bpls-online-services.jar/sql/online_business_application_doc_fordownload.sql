[getListForDownload]
select doc.objid, oa.state 
from online_business_application_doc_fordownload d
	inner join online_business_application_doc doc on doc.objid = d.objid 
	inner join online_business_application oa on oa.objid = doc.parentid 
where d.scheduledate < $P{rundate} 
	and oa.state IN ('OPEN','PROCESSING','COMPLETED') 
order by d.scheduledate, d.objid 
limit 25
