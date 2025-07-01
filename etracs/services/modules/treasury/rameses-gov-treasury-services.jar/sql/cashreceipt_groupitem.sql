[getReceipts]
select gi.*, c.receiptno
from cashreceipt_groupitem gi 
	inner join cashreceipt c on c.objid = gi.objid 
where gi.parentid = $P{parentid}


[findGroupByItem]
select g.* 
from cashreceipt_groupitem gi 
	inner join cashreceipt_group g on g.objid = gi.parentid 
where gi.objid = $P{groupitemid} 
