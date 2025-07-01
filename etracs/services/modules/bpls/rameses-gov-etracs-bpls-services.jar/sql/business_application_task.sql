[getTasks]
select bt.* 
from business_application_task bt 
where bt.refid = $P{refid} 
order by bt.startdate, bt.parentprocessid, bt.enddate 

[findCurrentStatus]
select * 
from business_application_task bt 
	left join sys_wf_node n on (n.processname = 'business_application' and n.name = bt.state) 
where bt.refid = $P{refid} 
	and bt.enddate is null 
	and n.nodetype = 'state' 
order by bt.startdate, n.idx  

[findCurrentStatusByAppno]
SELECT bt.state 
FROM business_application_task bt 
	INNER JOIN business_application ba ON ba.objid = bt.refid 
	LEFT JOIN sys_wf_node n on (n.processname = 'business_application' and n.name = bt.state) 
WHERE ba.appno = $P{appno} 
	AND bt.enddate IS NULL 
	AND n.nodetype = 'state' 
ORDER BY bt.startdate, n.idx 

[findCurrentTaskByAppno]
SELECT bt.objid AS taskid
FROM business_application_task bt 
	INNER JOIN business_application ba ON ba.objid = bt.refid
	LEFT JOIN sys_wf_node n on (n.processname = 'business_application' and n.name = bt.state) 
WHERE ba.appno = $P{appno} 
	AND bt.enddate IS NULL 
	AND n.nodetype = 'state' 
ORDER BY bt.startdate, n.idx 

[findCurrentTaskByAppid]
SELECT bt.objid AS taskid, bt.*
FROM business_application_task bt 
	INNER JOIN business_application ba ON ba.objid = bt.refid 
	LEFT JOIN sys_wf_node n on (n.processname = 'business_application' and n.name = bt.state) 
WHERE ba.objid = $P{applicationid} 
	AND bt.enddate IS NULL 
	AND n.nodetype = 'state' 
ORDER BY bt.refid, bt.startdate, n.idx 

[findStatusByBIN]
SELECT bt.assignee_name, bt.startdate, bt.state, ba.apptype, ba.appno, ba.dtfiled  
FROM business_application_task bt
INNER JOIN business_application ba ON bt.refid=ba.objid 
INNER JOIN business b ON b.objid=ba.business_objid
WHERE b.bin = $P{bin}


[deleteTasks]
DELETE FROM business_application_task WHERE refid=$P{applicationid} 

[findReturnToInfo]
select *
from business_application_task
where refid = $P{refid}
  and state = $P{state}
order by startdate desc 

[findLastTask]
select tsk.* 
from ( 
	select refid, max(startdate) as startdate  
	from business_application_task 
	where refid = $P{refid} ${filter} 
	group by refid 
)tmp  
	inner join business_application_task tsk on tsk.refid=tmp.refid 
where tsk.startdate=tmp.startdate 

[findOpenForkTask]
select t.*, p.state as parentstate  
from business_application_task t 
	left join business_application_task p on p.objid = t.parentprocessid 
where t.refid = $P{refid} 
	and t.parentprocessid = $P{parentprocessid} 
	and t.enddate IS NULL 

[getForkTasks]
select tsk.* 
from ( 
	select objid 
	from business_application_task 
	where objid = $P{processid} 
	union 
	select objid 
	from business_application_task 
	where parentprocessid = $P{processid} 
)t1, business_application_task tsk 
where tsk.objid = t1.objid 
order by tsk.parentprocessid 

[findTask]
select * 
from business_application_task 
where objid = $P{processid} 

[getClosedTasks]
select t.* 
from business_application_task t 
	left join business_application_task c on c.parentprocessid = t.objid 
where t.refid = $P{refid} 
	and t.assignee_objid is not null 
	and t.enddate is not null 
	and c.objid is null 
order by t.startdate, t.parentprocessid, t.enddate 
