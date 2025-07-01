[getReceipts]
select c.*, g.objid as group_objid 
from cashreceipt_group g 
	inner join cashreceipt_groupitem gi on gi.parentid = g.objid 
	inner join cashreceipt c on c.objid = gi.objid 
where g.objid = $P{objid} 
order by c.receiptdate, c.receiptno 
