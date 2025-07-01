[getCollectionTypes]
select 
	t0.remittanceid, t0.formno, 
	min(t0.seriesno) as fromseries, 
	max(t0.seriesno) as toseries,
	sum(t0.amount) as amount 
from ( 
	select 
		r.objid as remittanceid, 'EOR' as formno, 
		substring(e.receiptno, locate('EOR', e.receiptno) + 3) as seriesno, 
		(case when e.state = 'CANCELLED' then 0.0 else e.amount end) as amount 
	from eor_remittance r 
		inner join paymentpartner pp on pp.objid = r.partnerid 
		inner join eor e on e.remittanceid = r.objid 
	where r.objid = $P{remittanceid} 
)t0 
group by t0.remittanceid, t0.formno


[getCollectionSummaries]
select 
	t0.remittanceid, t0.particulars, 
	sum(t0.amount) as amount 
from ( 
	select 
		e.remittanceid, ei.amount, 
		upper( concat(po.txntype, ': ', rf.fund_title)) as particulars 
	from eor_remittance r 
		inner join eor e on e.remittanceid = r.objid 
		inner join eor_paymentorder_paid po on po.objid = e.paymentrefid 
		inner join eor_item ei on ei.parentid = e.objid 
		left join eor_remittance_fund rf on (
			rf.remittanceid = r.objid and rf.fund_objid = ei.item_fund_objid 
		)
	where r.objid = $P{remittanceid} 
)t0 
group by t0.remittanceid, t0.particulars 
order by t0.particulars 


[getPrevBalances]
select 
	remittanceid, partnerid, 
	fund_objid as fundid, 
	(bal_1 + bal_2) as balance 
from ( 
	select t0.*, 
		ifnull((
			select sum(amount) from vw_eor_item 
				where remittanceid is null 
					and receiptdate <= t0.controldate 
					and txndate <= t0.dtcreated  
					and item_fund_objid = t0.fund_objid 
					and partnerid = t0.partnerid 
		), 0.0) as bal_1, 		
		ifnull((
			select sum(amount) from vw_eor_item_remitted 
				where remittance_controldate <= t0.controldate 
					and remittance_dtcreated <= t0.dtcreated 
					and item_fund_objid = t0.fund_objid 
					and partnerid = t0.partnerid 
		), 0.0) as bal_2 
	from ( 
		select 
			rf.remittanceid, rf.fund_objid, r.partnerid, 
			r.controldate, r.dtcreated 
		from eor_remittance r 
			inner join eor_remittance_fund rf on rf.remittanceid = r.objid 
		where r.objid = $P{remittanceid} 
	)t0 
)t1 


[getFundReceipts]
select 
	t0.receiptid, e.receiptno, e.receiptdate, e.txndate, 
	e.paidby, e.remarks as particulars, t0.amount 
from ( 
	select ei.parentid as receiptid, sum(ei.amount) as amount 
	from eor_remittance_fund rf   
		inner join eor e on e.remittanceid = rf.remittanceid 
		inner join eor_item ei on ( 
			ei.parentid = e.objid and ei.item_fund_objid = rf.fund_objid 
		) 
	where rf.objid = $P{remittancefundid} 
	group by ei.parentid 
)t0 
	inner join eor e on e.objid = t0.receiptid 
order by e.receiptdate, e.receiptno 


[findFundReceiptSummary]
select 
	t1.remittanceid, t1.formno, 
	min(t1.seriesno) as fromseries, 
	max(t1.seriesno) as toseries, 
	sum(t1.amount) as amount 
from ( 
	select 
		e.remittanceid, 'EOR' as formno, 
		substring(e.receiptno, locate('EOR', e.receiptno) + 3) as seriesno, 
		(case when e.state = 'CANCELLED' then 0.0 else t0.amount end) as amount 
	from ( 
		select ei.parentid as receiptid, sum(ei.amount) as amount 
		from eor_remittance_fund rf   
			inner join eor e on e.remittanceid = rf.remittanceid 
			inner join eor_item ei on ( 
				ei.parentid = e.objid and ei.item_fund_objid = rf.fund_objid 
			) 
		where rf.objid = $P{remittancefundid} 
		group by ei.parentid 
	)t0 
		inner join eor e on e.objid = t0.receiptid 
)t1 
group by t1.remittanceid, t1.formno 
