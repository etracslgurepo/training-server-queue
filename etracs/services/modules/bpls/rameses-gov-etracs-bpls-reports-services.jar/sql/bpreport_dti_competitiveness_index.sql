[getListByDateApplied]
select 
	b.tradename, b.businessname, b.address_text, 
	t2.apptype, b.yearstarted, b.owner_name, b.orgtype, 
	(case 
		when b.orgtype='SING' then 'SINGLE PROPRIETORSHIP' 
		when b.orgtype='CORP' then 'CORPORATION' 
		when b.orgtype='COOP' then 'COOPERATIVE' 
		when b.orgtype='ASSO' then 'ASSOCIATION' 
		when b.orgtype='REL' then 'RELIGIOUS' 
		when b.orgtype='FOUND' then 'FOUNDATION' 
		when b.orgtype='PART' then 'PARTNERSHIP' 
		when b.orgtype='GOV' then 'GOVERNMENT' 
		when b.orgtype='SCH' then 'SCHOOL' 
		when b.orgtype='NGO' then 'NON-GOVERNMENT ORGANIZATION' 
	end) as orgtypetitle, 
	(case 
		when t2.bsize = 1 then 'Micro'
		when t2.bsize = 2 then 'Small'
		when t2.bsize = 3 then 'Medium' 
		else 'Large' 
	end) as business_size, 
	(
		select permitno from business_permit 
		where businessid = t2.business_objid 
			and activeyear = t2.appyear 
			and state = 'ACTIVE' 
		order by dtissued desc, version desc 
		limit 1 
	) as permitno, 
	(
		select GROUP_CONCAT(DISTINCT concat(' ', classification_objid))
		from business_application a, business_application_lob al, lob 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.applicationid = a.objid 
			and al.assessmenttype in ('NEW','RENEW') 
			and lob.objid = al.lobid 
	) as lobclass, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', lob.name))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join lob on lob.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as lob, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', v.psic_description))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join vw_lob v on v.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as psic_subclass_name, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', v.psic_section_description))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join vw_lob v on v.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as psic_class_name
from ( 
	select apptype, business_objid, appyear, 
		(case when max(size_1) > max(size_2) then max(size_1) else max(size_2) end) as bsize 
	from ( 
		select apptype, business_objid, appyear, max(size_1) as size_1, 1 as size_2 
		from (  
			select 
				a.apptype, a.business_objid, a.appyear, ai.lob_objid, 
				(case 
					when ai.decimalvalue > 100000000 then 4
					when ai.decimalvalue >  15000000 then 3
					when ai.decimalvalue >   3000000 then 2
					else 1 
				end) as size_1 
			from business_application a 
				inner join business_application_info ai on ( 
					ai.applicationid = a.objid and ai.attribute_objid in ('GROSS','CAPITAL') 
				) 
			where a.dtfiled >= $P{startdate} 
				and a.dtfiled <= $P{enddate} 
				and a.appyear = YEAR(a.dtfiled) 
				and a.apptype in ('NEW','RENEW') 
				and a.state in ('COMPLETED') 
		)t0 
		group by apptype, business_objid, appyear 

		union all 

		select 
			a.apptype, a.business_objid, a.appyear, 1 as size_1,  
			max((case 
				when ai.intvalue >= 200 then 4
				when ai.intvalue >= 100 then 3
				when ai.intvalue >= 10 then 2
				else 1 
			end)) as size_2
		from business_application a 
			inner join business_application_info ai on ( 
				ai.applicationid = a.objid and ai.attribute_objid in ('NUM_EMPLOYEE') 
			) 
		where a.dtfiled >= $P{startdate} 
			and a.dtfiled <= $P{enddate} 
			and a.appyear = YEAR(a.dtfiled) 
			and a.apptype in ('NEW','RENEW') 
			and a.state in ('COMPLETED') 
		group by a.apptype, a.business_objid, a.appyear 
	)t1
	group by apptype, business_objid, appyear 
)t2 
	inner join business b on b.objid = t2.business_objid 
where b.permittype = $P{permittypeid} 
order by b.businessname 


[getListByDateReleased]
select 
	b.tradename, b.businessname, b.address_text, 
	t2.apptype, b.yearstarted, b.owner_name, b.orgtype, 
	(case 
		when b.orgtype='SING' then 'SINGLE PROPRIETORSHIP' 
		when b.orgtype='CORP' then 'CORPORATION' 
		when b.orgtype='COOP' then 'COOPERATIVE' 
		when b.orgtype='ASSO' then 'ASSOCIATION' 
		when b.orgtype='REL' then 'RELIGIOUS' 
		when b.orgtype='FOUND' then 'FOUNDATION' 
		when b.orgtype='PART' then 'PARTNERSHIP' 
		when b.orgtype='GOV' then 'GOVERNMENT' 
		when b.orgtype='SCH' then 'SCHOOL' 
		when b.orgtype='NGO' then 'NON-GOVERNMENT ORGANIZATION' 
	end) as orgtypetitle, 
	(case 
		when t2.bsize = 1 then 'Micro'
		when t2.bsize = 2 then 'Small'
		when t2.bsize = 3 then 'Medium' 
		else 'Large' 
	end) as business_size, 
	(
		select permitno from business_permit 
		where businessid = t2.business_objid 
			and activeyear = t2.appyear 
			and state = 'ACTIVE' 
		order by dtissued desc, version desc 
		limit 1 
	) as permitno, 
	(
		select GROUP_CONCAT(DISTINCT concat(' ', classification_objid))
		from business_application a, business_application_lob al, lob 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.applicationid = a.objid 
			and al.assessmenttype in ('NEW','RENEW') 
			and lob.objid = al.lobid 
	) as lobclass, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', lob.name))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join lob on lob.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as lob, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', v.psic_description))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join vw_lob v on v.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as psic_subclass_name, 
 	(
		select GROUP_CONCAT(DISTINCT concat(' ', v.psic_section_description))
		from business_application a 
			inner join business_application_lob al on al.applicationid = a.objid 
			inner join vw_lob v on v.objid = al.lobid 
		where a.business_objid = t2.business_objid 
			and a.appyear = t2.appyear 
			and a.apptype in ('NEW','RENEW') 
			and a.state = 'COMPLETED' 
			and al.assessmenttype in ('NEW','RENEW') 
	) as psic_class_name
from ( 
	select apptype, business_objid, appyear, 
		(case when max(size_1) > max(size_2) then max(size_1) else max(size_2) end) as bsize 
	from ( 
		select apptype, business_objid, appyear, max(size_1) as size_1, 1 as size_2 
		from (  
			select 
				a.apptype, a.business_objid, a.appyear, ai.lob_objid, 
				(case 
					when ai.decimalvalue > 100000000 then 4
					when ai.decimalvalue >  15000000 then 3
					when ai.decimalvalue >   3000000 then 2
					else 1 
				end) as size_1 
			from business_application_task t 
				inner join business_application a on a.objid = t.refid  
				inner join business_application_info ai on ( 
					ai.applicationid = a.objid and ai.attribute_objid in ('GROSS','CAPITAL') 
				) 
			where t.enddate >= $P{startdate} 
				and t.enddate <= $P{enddate} 
				and t.state = 'release' 
				and a.appyear = YEAR(t.enddate) 
				and a.apptype in ('NEW','RENEW') 
				and a.state in ('COMPLETED') 
		)t0 
		group by apptype, business_objid, appyear 

		union all 

		select 
			a.apptype, a.business_objid, a.appyear, 1 as size_1,  
			max((case 
				when ai.intvalue >= 200 then 4
				when ai.intvalue >= 100 then 3
				when ai.intvalue >= 10 then 2
				else 1 
			end)) as size_2
		from business_application_task t 
			inner join business_application a on a.objid = t.refid  
			inner join business_application_info ai on ( 
				ai.applicationid = a.objid and ai.attribute_objid in ('NUM_EMPLOYEE') 
			) 
		where t.enddate >= $P{startdate} 
			and t.enddate <= $P{enddate} 
			and t.state = 'release' 
			and a.appyear = YEAR(t.enddate) 
			and a.apptype in ('NEW','RENEW') 
			and a.state in ('COMPLETED') 
		group by a.apptype, a.business_objid, a.appyear 
	)t1
	group by apptype, business_objid, appyear 
)t2 
	inner join business b on b.objid = t2.business_objid 
where b.permittype = $P{permittypeid} 
order by b.businessname 
