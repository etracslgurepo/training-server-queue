[getApplicationRequirements]
SELECT DISTINCT a.* FROM (
	SELECT br.*,bt.agency,bt.verifier   FROM business_requirement br 
	INNER JOIN businessrequirementtype bt ON br.reftype=bt.objid	
	WHERE br.applicationid=$P{applicationid}
	UNION  
	SELECT br.*,bt.agency,bt.verifier   FROM business_requirement br 
	INNER JOIN businessrequirementtype bt ON br.reftype=bt.objid	
	WHERE br.applicationid IS NULL AND br.businessid=$P{businessid} 
) a

[getUnexpiredApplicationRequirements]
SELECT br.*, brq.agency, brq.verifier 
FROM (
	SELECT a.*, 
		(SELECT objid FROM business_requirement 
			WHERE businessid=$P{businessid} AND reftype=a.reftype AND IFNULL(expirydate,0)=a.expirydate 
				ORDER BY expirydate DESC LIMIT 1 
		) AS objid 
	FROM (
		SELECT br.businessid, br.reftype, IFNULL(MAX(br.expirydate),0) AS expirydate  
		FROM business_requirement br 
		WHERE br.businessid=$P{businessid}   
			AND (br.expirydate IS NULL OR br.expirydate >= $P{currentdate}) 
		GROUP BY br.businessid, br.reftype 
	)a 
)bt 
	INNER JOIN business_requirement br ON bt.objid=br.objid 
	INNER JOIN businessrequirementtype brq ON br.reftype=brq.objid	
ORDER BY br.title 

[removeApplicationRequirements]
delete from business_requirement where applicationid=$P{applicationid} 

[removeNonApplicationRequirements]
delete from business_requirement where businessid=$P{businessid} and applicationid is null 


[getUnexpiredListForRenewal]
select r.* 
from ( 
	select 
		rt.objid as reqtype, 
		(
			select r.objid 
			from 
				(select cast(NOW() as DATE) as rundate) dt 
				inner join business b on b.objid = $P{businessid} 
				inner join business_application a on ( 
					a.business_objid = b.objid and a.appyear < $P{appyear} 
						and a.apptype in ('NEW','RENEW','ADDITIONAL') 
				) 
				inner join business_requirement r on ( 
					r.applicationid = a.objid and r.completed = 1 
						and r.expirydate > dt.rundate 
				) 
			where r.reftype = rt.objid 
			order by a.appyear desc, a.txndate desc 
			limit 1 
		) as requirementid 
	from businessrequirementtype rt 
)t0, business_requirement r 
where r.objid = t0.requirementid 
