[getActiveList]
select 
	nc.counterid, n.sectionid, s.groupid, n.seriesno, 
	s.prefix, c.`code` as countercode, s.title as sectiontitle 
from queue_group g 
	inner join queue_section s on s.groupid = g.objid 
	inner join queue_number n on n.sectionid = s.objid 
	inner join queue_number_counter nc on nc.objid = n.objid 
	inner join queue_counter c on c.objid = nc.counterid 
where g.objid = $P{groupid} 
order by n.txndate 
