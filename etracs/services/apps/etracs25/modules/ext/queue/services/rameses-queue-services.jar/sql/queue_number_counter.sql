[getListByCounterid]
select qnc.counterid, qc.code, qn.*, qs.prefix, qs.title 
from queue_number_counter qnc
	inner join queue_number qn on qn.objid = qnc.objid 
	left join queue_section qs on qs.objid = qn.sectionid 
	left join queue_counter qc on qc.objid = qnc.counterid 
where qnc.counterid = $P{counterid}
