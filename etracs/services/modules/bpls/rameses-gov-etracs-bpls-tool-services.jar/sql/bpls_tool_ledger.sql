[findPayment]
select * 
from business_payment 
where objid = $P{objid} 

[getPaymentItems]
select * 
from business_payment_item 
where parentid = $P{paymentid} 

[getReceiptItems]
select 
	bp.objid as paymentid, ci.receiptid, c.receiptno, c.receiptdate, 
	ci.item_objid, ci.item_code, ci.item_title, ci.amount, ci.remarks 
from business_payment bp 
	inner join cashreceipt c on c.objid = bp.refid 	
	inner join cashreceiptitem ci on ci.receiptid = c.objid 
where bp.objid = $P{paymentid} 
	and bp.voided = 0 
order by c.receiptdate, c.receiptno, ci.item_title, ci.remarks  

[getGroupReceiptItems]
select 
	bp.objid as paymentid, ci.receiptid, c.receiptno, c.receiptdate, 
	ci.item_objid, ci.item_code, ci.item_title, ci.amount, ci.remarks 
from business_payment bp 
	inner join cashreceipt_groupitem gi on gi.parentid = bp.objid 
	inner join cashreceipt c on c.objid = gi.objid 
	inner join cashreceiptitem ci on ci.receiptid = c.objid 
where bp.objid = $P{paymentid} 
	and bp.voided = 0 
order by c.receiptdate, c.receiptno, ci.item_title, ci.remarks  

[getReceivables]
select r.* 
from business_receivable r 
where r.applicationid = $P{applicationid} 
	and ${filters} 
order by r.iyear, r.taxfeetype, r.account_title, r.lob_name 

[findReceivable]
select * from business_receivable where objid = $P{objid} 
