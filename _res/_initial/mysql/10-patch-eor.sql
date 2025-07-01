
USE `training_eor`;


-- ## 2025-05-15

create index ix_state on eor_remittance (state)
;
create unique index uix_controlno on eor_remittance (controlno)
;
create index ix_controldate on eor_remittance (controldate)
;
create index ix_partnerid on eor_remittance (partnerid)
;
create index ix_dtcreated on eor_remittance (dtcreated)
;
create index ix_createdby_objid on eor_remittance (createdby_objid)
;
create index ix_createdby_name on eor_remittance (createdby_name)
;
create index ix_dtposted on eor_remittance (dtposted)
;
create index ix_postedby_objid on eor_remittance (postedby_objid)
;
create index ix_postedby_name on eor_remittance (postedby_name)
;


create index ix_remittanceid on eor_remittance_fund (remittanceid)
;
create index ix_fund_objid on eor_remittance_fund (fund_objid)
;
create index ix_bankaccount_objid on eor_remittance_fund (bankaccount_objid)
;
create index ix_validation_refno on eor_remittance_fund (validation_refno)
;
create index ix_validation_refdate on eor_remittance_fund (validation_refdate)
;

drop index fk_eor_remittance_fund_remittance on eor_remittance_fund
;


create index ix_state on eor (state);


drop table if exists vw_eor_item
;
drop view if exists vw_eor_item
;
create view vw_eor_item as 
select ei.*, 
	e.receiptno, e.receiptdate, e.txndate, e.state, 
	e.partnerid, e.txntype, e.paymentrefid, e.remittanceid 
from eor e 
	inner join eor_item ei on ei.parentid = e.objid 
;


drop table if exists vw_eor_item_remitted
;
drop view if exists vw_eor_item_remitted
;
create view vw_eor_item_remitted as 
select ei.*, 
	e.receiptno, e.receiptdate, e.txndate, e.state, 
	e.partnerid, e.txntype, e.paymentrefid, e.remittanceid, 
	r.controlno as remittance_controlno, 
	r.controldate as remittance_controldate, 
	r.dtcreated as remittance_dtcreated 
from eor e 
	inner join eor_item ei on ei.parentid = e.objid 
	inner join eor_remittance r on r.objid = e.remittanceid 
;
