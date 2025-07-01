[getWorkflowRoles]
SELECT DISTINCT role, processname 
FROM sys_wf_node 
WHERE domain = $P{domain}
ORDER BY processname

[getTaskCount]
SELECT COUNT(*), bt.state, sn.role  
FROM building_application_task bt
INNER JOIN sys_wf_node sn ON sn.processname = 'building_application' AND sn.name = bt.state 
WHERE bt.assignee_objid IS NULL
AND bt.enddate IS NULL 
AND bt.state NOT IN ('start', 'end' )
AND sn.tracktime = 1
AND NOT(sn.role IS NULL )
AND sn.role IN ${building_application_roles}
GROUP BY bt.state, sn.role

