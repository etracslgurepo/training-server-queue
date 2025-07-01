[findRoot]
select o.*, 
	p.name as parent_name,  
  p.code as parent_code, 
	p.txncode as parent_txncode 
from sys_org o 
	left join sys_org p on p.objid = o.parent_objid 
where o.root = 1 
