[getList]
SELECT DISTINCT 
    ba.objid, ba.state AS appstate, ba.txndate, 
    ba.ownername AS business_owner_name, 
    ba.tradename AS business_businessname,
    ba.businessaddress AS business_address_text,
    b.bin AS business_bin, ba.appyear,
    ba.appno, ba.apptype, ba.dtfiled AS appdate, 
    tsk.assignee_objid, tsk.assignee_name, tsk.startdate, 
    tsk.state, tsk.enddate, tsk.objid AS taskid 
FROM (
    SELECT tsk.objid as taskid, tsk.refid as applicationid 
    FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
        LEFT JOIN business_application_task tsk ON tsk.refid = ba.objid 
        LEFT JOIN business_application_task tskc ON tskc.parentprocessid = tsk.objid  
    WHERE b.owner_name LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
        AND tskc.objid IS NULL 

    UNION 

    SELECT tsk.objid as taskid, tsk.refid as applicationid
    FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
        LEFT JOIN business_application_task tsk ON tsk.refid = ba.objid 
        LEFT JOIN business_application_task tskc ON tskc.parentprocessid = tsk.objid  
    WHERE b.businessname LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
        AND tskc.objid IS NULL 

    UNION

    SELECT tsk.objid as taskid, tsk.refid as applicationid
    FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
        LEFT JOIN business_application_task tsk ON tsk.refid = ba.objid 
        LEFT JOIN business_application_task tskc ON tskc.parentprocessid = tsk.objid  
    WHERE b.bin LIKE $P{searchtext} ${filter}  
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
        AND tskc.objid IS NULL 

    UNION 

    SELECT tsk.objid as taskid, tsk.refid as applicationid 
    FROM business_application ba 
        LEFT JOIN business_application_task tsk ON tsk.refid = ba.objid
        LEFT JOIN business_application_task tskc ON tskc.parentprocessid = tsk.objid  
    WHERE ba.appno LIKE $P{searchtext} ${filter}  
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
        AND tskc.objid IS NULL 
)bt 
    INNER JOIN business_application ba on ba.objid = bt.applicationid 
    INNER JOIN business b on b.objid = ba.business_objid 
    LEFT JOIN business_application_task tsk ON tsk.objid = bt.taskid 
WHERE b.state NOT IN ('CANCELLED') 
ORDER BY ba.appyear DESC, ba.txndate ASC 


[getMyTaskList]
SELECT 
    ba.objid, ba.state AS appstate, ba.txndate, 
    ba.ownername AS business_owner_name, 
    ba.tradename AS business_businessname,
    ba.businessaddress AS business_address_text,
    b.bin AS business_bin, ba.appyear,
    ba.appno, ba.apptype, ba.dtfiled AS appdate, 
    tsk.assignee_objid, tsk.assignee_name, tsk.startdate, 
    tsk.state, tsk.enddate, tsk.objid AS taskid 
FROM business_application_task tsk  
    INNER JOIN business_application ba ON ba.objid = tsk.refid 
    INNER JOIN business b ON b.objid = ba.business_objid 
WHERE tsk.assignee_objid = $P{assigneeid} 
    AND tsk.enddate IS NULL 
    AND ba.appyear = YEAR(NOW()) 
ORDER BY tsk.startdate 


[getClosedTaskList]
SELECT 
    ba.objid, ba.state AS appstate,
    ba.ownername AS business_owner_name,
    ba.tradename AS business_businessname,
    ba.businessaddress AS business_address_text,
    b.bin AS business_bin, ba.appyear,
    ba.appno, ba.apptype, ba.dtfiled AS appdate
FROM (
    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.owner_name LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 

    UNION 

    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.businessname LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 

    UNION 

    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.bin LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 

    UNION 

    SELECT ba.objid FROM business_application ba 
        INNER JOIN business b ON b.objid = ba.business_objid 
    WHERE ba.appno LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
)bt 
    INNER JOIN business_application ba ON ba.objid = bt.objid 
    INNER JOIN business b ON b.objid = ba.business_objid 


[getCompletedList]
SELECT 
    ba.objid, ba.state AS appstate,
    ba.ownername AS business_owner_name,
    ba.tradename AS business_businessname,
    ba.businessaddress AS business_address_text,
    b.bin AS business_bin, ba.appyear,
    ba.appno, ba.apptype, ba.dtfiled AS appdate
FROM (
    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.owner_name LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
    
    UNION 
    
    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.businessname LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
    
    UNION
    
    SELECT ba.objid FROM business b 
        INNER JOIN business_application ba ON ba.business_objid = b.objid 
    WHERE b.bin LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
    
    UNION
    
    SELECT ba.objid FROM business_application ba 
    WHERE ba.appno LIKE $P{searchtext} ${filter} 
        AND ba.apptype IN ( 'NEW','RENEW','RETIRE','ADDITIONAL','RETIRELOB' ) 
)bt 
    INNER JOIN business_application ba ON ba.objid = bt.objid 
    INNER JOIN business b ON b.objid = ba.business_objid 


[findIdByAppno]
SELECT objid FROM business_application 
WHERE appno = $P{appno}


[findInfoByBIN]
SELECT 
    ba.*, b.tradename, b.owner_objid, b.owner_name, b.bin, 
    b.address_objid, b.address_text, b.businessname  
FROM business b 
    INNER JOIN business_application ba ON ba.objid = b.currentapplicationid 
WHERE b.bin = $P{bin} 


[findInfoByAppno]
SELECT 
    ba.*, b.tradename, b.owner_objid, b.owner_name, b.bin, 
    b.address_objid, b.address_text, b.businessname  
FROM business_application ba 
    INNER JOIN business b ON b.objid = ba.business_objid 
WHERE ba.appno = $P{appno}


[findInfoByAppid]
SELECT 
    ba.*, b.tradename, b.owner_objid, b.owner_name, b.bin, 
    b.address_objid, b.address_text, b.businessname 
FROM business_application ba 
    INNER JOIN business b ON b.objid = ba.business_objid 
WHERE ba.objid = $P{applicationid} 


[getInfosByBusinessIdAndYear]
SELECT * FROM business_application 
WHERE business_objid = $P{businessid} 
    AND appyear = $P{appyear} 
    AND apptype = $P{apptype}


[getListByBusiness]
select a.*, t0.*  
from ( 
    select 
        a.objid as applicationid, 
        sum(r.amount) as totalamount, 
        sum(r.amtpaid) as totalamtpaid, 
        (sum(r.amount) - sum(r.amtpaid)) as balance 
    from business_application a 
        left join business_receivable r on r.applicationid = a.objid 
    where a.business_objid = $P{businessid} 
    group by a.objid 
)t0, business_application a 
where a.objid = t0.applicationid 
order by a.appyear desc, a.dtfiled desc, a.txndate desc 


[updatePermit]
UPDATE business_application SET 
    state = 'COMPLETED', 
    dtreleased = $P{dtreleased}, 
    permit_objid = $P{permitid} 
WHERE 
    objid = $P{applicationid}


[getOpenApplications]
SELECT * FROM business_application 
WHERE business_objid = $P{businessid} 
    AND state NOT IN ('COMPLETED', 'CANCELLED') ${filter}


[updateOpenApplicationsOwner]
UPDATE business_application SET 
    ownername = $P{ownername} 
WHERE business_objid = $P{businessid} 
    AND state NOT IN ('COMPLETED', 'CANCELLED') 


[updateOpenApplicationsBusinessName]
UPDATE business_application SET 
    tradename = $P{tradename} 
WHERE business_objid = $P{businessid} 
    AND state NOT IN ('COMPLETED','CANCELLED') 


[updateOpenApplicationsBusinessAddress]
UPDATE business_application SET 
    businessaddress = $P{businessaddress} 
WHERE business_objid = $P{businessid} 
    AND state NOT IN ('COMPLETED', 'CANCELLED') 


[findBusinessInfoByAppno]
SELECT 
    a.objid AS applicationid, b.objid AS businessid, b.address_text,
    b.businessname, b.tradename, b.owner_objid, b.owner_name, 
    b.owner_address_text, b.bin  
FROM business_application a 
    INNER JOIN business b ON b.objid = a.business_objid 
WHERE a.appno = $P{appno}


[updateExpirydate]
UPDATE business_application SET 
    expirydate = $P{expirydate} 
WHERE 
    objid = $P{applicationid}


[updateState]
UPDATE business_application SET 
    state = $P{state} 
WHERE 
    objid = $P{applicationid}


[findMobileNo]
SELECT b.mobileno 
FROM business_application ba
    INNER JOIN business b ON b.objid = ba.business_objid 
WHERE ba.objid = $P{objid}


[findNextBillDate]
SELECT objid, nextbilldate 
FROM business_application 
WHERE objid = $P{applicationid} 


[updateNextBillDate]
UPDATE business_application SET 
    nextbilldate = $P{nextbilldate} 
WHERE 
    objid = $P{applicationid}  


[getAppLobs]
select * from business_application_lob 
where applicationid = $P{applicationid} 


[getAppInfos]
select * from business_application_info 
where applicationid = $P{applicationid} 
    and type = 'appinfo'


[getAssessmentInfos]
select * from business_application_info 
where applicationid = $P{applicationid} 
    and type = 'assessmentinfo'


[findLatestApplication]
select a.* 
from ( 
    select business_objid, max(appyear) as appyear, max(txndate) as txndate 
    from business_application 
    where business_objid = $P{businessid} 
    group by business_objid 
)xx 
    inner join business_application a on a.business_objid = xx.business_objid 
where a.appyear = xx.appyear and a.txndate = xx.txndate 


[getDelinquentApplications]
select 
    b.objid as businessid, a.appyear as iyear, 
    sum(r.amount) as amount, sum(r.amtpaid) as amtpaid, 
    (sum(r.amount) - sum(r.amtpaid)) as balance 
from business b 
    inner join business_application a on a.business_objid = b.objid 
    inner join business_receivable r on r.applicationid = a.objid 
where b.objid = $P{businessid} 
    and a.appyear < $P{appyear} 
    and a.state in ('PAYMENT','RELEASE','COMPLETED') 
group by b.objid, a.appyear 
having (sum(r.amount)-sum(r.amtpaid)) > 0 
order by a.appyear 


[findBusinessAddress]
select addr.* 
from business_application ba 
    inner join business b on b.objid = ba.business_objid 
    inner join business_address addr on addr.objid = b.address_objid 
where ba.objid = $P{applicationid}
