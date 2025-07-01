-- ## Build 2.5.05.02-002
-- ## 2023-06-23

drop table if exists vw_entityindividual
;
drop view if exists vw_entityindividual
;
create view vw_entityindividual as 
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
; 


drop table if exists vw_entityjuridical
;
drop view if exists vw_entityjuridical
;
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
;


drop table if exists vw_entitymultiple
;
drop view if exists vw_entitymultiple
;
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
;


drop table if exists vw_entity
;
drop view if exists vw_entity
;
create view vw_entity AS 
select * from entity 
;
