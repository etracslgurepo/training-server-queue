-- ## Build 2.5.05.02-002
-- ## 2023-06-23

if object_id('dbo.vw_entityindividual', 'U') IS NOT NULL 
  drop table dbo.vw_entityindividual; 
go 
if object_id('dbo.vw_entityindividual', 'V') IS NOT NULL 
  drop view dbo.vw_entityindividual; 
go 
create view vw_entityindividual AS 
select 
  ei.*, 
  e.entityno AS entityno, 
  e.type AS type, 
  e.name AS name, 
  e.entityname AS entityname, 
  e.mobileno AS mobileno, 
  e.phoneno AS phoneno, 
  e.address_objid AS address_objid, 
  e.address_text AS address_text, 
  e.state as state 
from entityindividual ei 
  inner join entity e on e.objid = ei.objid 
go


if object_id('dbo.vw_entityjuridical', 'U') IS NOT NULL 
  drop table dbo.vw_entityjuridical; 
go 
if object_id('dbo.vw_entityjuridical', 'V') IS NOT NULL 
  drop view dbo.vw_entityjuridical; 
go 
create view vw_entityjuridical AS 
select 
  ej.*, 
  e.state, 
  e.entityno, 
  e.entityname, 
  e.name, 
  e.address_objid, 
  e.address_text, 
  e.type 
from entityjuridical ej
  inner join entity e on e.objid = ej.objid 
go


if object_id('dbo.vw_entitymultiple', 'U') IS NOT NULL 
  drop table dbo.vw_entitymultiple; 
go 
if object_id('dbo.vw_entitymultiple', 'V') IS NOT NULL 
  drop view dbo.vw_entitymultiple; 
go 
create view vw_entitymultiple AS 
select 
  em.*, 
  e.state, 
  e.entityno, 
  e.entityname, 
  e.name, 
  e.address_objid, 
  e.address_text, 
  e.type 
from entitymultiple em 
  inner join entity e on e.objid = em.objid 
go 


if object_id('dbo.vw_entity', 'U') IS NOT NULL 
  drop table dbo.vw_entity; 
go 
if object_id('dbo.vw_entity', 'V') IS NOT NULL 
  drop view dbo.vw_entity; 
go 
create view vw_entity AS 
select * from entity 
go
