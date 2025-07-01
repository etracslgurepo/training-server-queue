[getList]
select aa.*, 
	(case when (aa.amount-aa.amtpaid) > 0 then 0 else 1 end) as paid
from 
	business_receivable aa, 
	( 
		select distinct acctid 
		from itemaccount_tag 
		where tag = $P{tag} 
	)bb  
where aa.applicationid = $P{applicationid} 
	and aa.account_objid = bb.acctid 


[findFee]
select aa.* 
from 
	business_receivable aa, 
	( 
		select distinct acctid 
		from itemaccount_tag 
		where tag = $P{tag} 
	)bb 
where aa.objid = $P{objid} 
	and aa.account_objid = bb.acctid 


[updateFee]
update business_receivable set 
	amtpaid = (case 
		when $P{state} = 0 then 0.0 
		when $P{state} = 1 then amount 
		else amtpaid 
	end) 
where objid = $P{objid} 
