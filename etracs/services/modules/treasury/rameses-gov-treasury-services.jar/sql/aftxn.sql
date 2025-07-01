[getReturnItems]
select * 
from ( 
	select distinct 
		a.afid as af_objid, af.title as af_title, af.formtype as af_formtype, 
		(case when af.formtype = 'serial' then 0 else 1 end) as af_formtypeindex, 
		af.serieslength as af_serieslength, af.denomination as af_denomination, 
		a.unit, a.stubno, a.prefix, a.suffix, d.qtyending as qty, 
		d.endingstartseries as startseries, d.endingendseries as endseries 
	from af_control_detail d 
		inner join af_control a on a.objid = d.controlid 
		left join af on af.objid = a.afid 
	where d.aftxnid = $P{aftxnid} 
		and d.reftype = 'RETURN' 
		and a.objid = d.controlid 
)t0 
order by af_formtypeindex, af_serieslength, af_objid, startseries 


[getTransferItems]
select * 
from ( 
	select distinct 
		a.afid as af_objid, af.title as af_title, af.formtype as af_formtype, 
		(case when af.formtype = 'serial' then 0 else 1 end) as af_formtypeindex, 
		af.serieslength as af_serieslength, af.denomination as af_denomination, 
		a.unit, a.stubno, a.prefix, a.suffix, d.qtyending as qty, 
		d.endingstartseries as startseries, d.endingendseries as endseries 
	from af_control_detail d 
		inner join af_control a on a.objid = d.controlid 
		left join af on af.objid = a.afid 
	where d.aftxnid = $P{aftxnid} 
		and d.reftype = 'TRANSFER' 
		and a.objid = d.controlid 
)t0 
order by af_formtypeindex, af_serieslength, af_objid, startseries 
