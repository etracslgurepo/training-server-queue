[getReport]
select 
	t1.activeyear, t1.imonth, 
	sum(t1.txncount) as txncount, sum(t1.amount) as total, 
	sum(t1.newamount) as newamount, sum(t1.renewamount) as renewamount, sum(t1.retireamount) as retireamount, 
	sum(t1.newcount) as newcount, sum(t1.renewcount) as renewcount, sum(t1.retirecount) as retirecount, 
	sum(t1.tax) as tax, sum(t1.fee) as fee, sum(t1.othercharge) as othercharge, 
	(case  
		when t1.imonth=1 then 'JANUARY'
		when t1.imonth=2 then 'FEBRUARY'
		when t1.imonth=3 then 'MARCH'
		when t1.imonth=4 then 'APRIL'
		when t1.imonth=5 then 'MAY'
		when t1.imonth=6 then 'JUNE'
		when t1.imonth=7 then 'JULY'
		when t1.imonth=8 then 'AUGUST'
		when t1.imonth=9 then 'SEPTEMBER'
		when t1.imonth=10 then 'OCTOBER'
		when t1.imonth=11 then 'NOVEMBER'
		when t1.imonth=12 then 'DECEMBER' 
	end) as strmonth,
	(case 
		when t1.imonth between 1 and 3 then 1 
		when t1.imonth between 4 and 6 then 2 
		when t1.imonth between 7 and 9 then 3 
		when t1.imonth between 10 and 12 then 4 
	end) as iqtr 
from ( 
	select 
		t0.businessid, t0.activeyear, t0.imonth, 1 as txncount, 
		sum(t0.amount) as amount, sum(t0.newamount) as newamount, 
		sum(t0.renewamount) as renewamount, sum(t0.retireamount) as retireamount, 
		sum(t0.tax) as tax, sum(t0.fee) as fee, sum(t0.othercharge) as othercharge, 
		(case when sum(t0.newamount) > 0 then 1 else 0 end) as newcount, 
		(case when sum(t0.renewamount) > 0 then 1 else 0 end) as renewcount, 
		(case when sum(t0.retireamount) > 0 then 1 else 0 end) as retirecount 
	from ( 
		select 
			b.objid as businessid, year(bpay.refdate) as activeyear, month(bpay.refdate) as imonth, 
			(bpayi.amount + bpayi.surcharge + bpayi.interest) as amount, 
			(case when ba.apptype in ('NEW','ADDITIONAL') then (bpayi.amount + bpayi.surcharge + bpayi.interest) else 0.0 end) as newamount, 
			(case when ba.apptype in ('RENEW') then (bpayi.amount + bpayi.surcharge + bpayi.interest) else 0.0 end) as renewamount, 
			(case when ba.apptype in ('RETIRE','RETIRELOB') then (bpayi.amount + bpayi.surcharge + bpayi.interest) else 0.0 end) as retireamount, 
			(case when br.taxfeetype = 'TAX' then bpayi.amount else 0.0 end) as tax, 
			(case when br.taxfeetype = 'REGFEE' then bpayi.amount else 0.0 end) as fee, 
			(case when br.taxfeetype not in ('TAX','REGFEE') then bpayi.amount else 0.0 end) as othercharge  
		from business_payment bpay 
			inner join business_application ba on ba.objid = bpay.applicationid 
			inner join business b on (b.objid = ba.business_objid and b.permittype = $P{permittypeid}) 
			inner join business_payment_item bpayi on bpayi.parentid = bpay.objid 
			left join business_receivable br on br.objid = bpayi.receivableid 
		where bpay.refdate >= $P{startdate} 
			and bpay.refdate < $P{enddate} 
			and bpay.voided = 0  
	)t0 
	group by t0.businessid, t0.activeyear, t0.imonth 
)t1 
group by t1.activeyear, t1.imonth 
order by t1.activeyear, t1.imonth
