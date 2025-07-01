
set @_province_pin  = '043';
set @_province_name = 'CEBU';

set @_municipal_pin  = '043-00';
set @_municipal_name = 'MUNI';



-- 
-- BEGIN PROCESS
-- 
set @_province_id   = replace(@_province_pin,'-','');
set @_municipal_id  = replace(@_municipal_pin,'-','');
set @_municipal_idx = substring(@_municipal_id, 4, 2);

-- 
-- delete previous data
-- 
delete from barangay;
delete from municipality;
delete from city;
delete from province;
update sys_org set parent_objid=null, parent_orgclass=null;
delete from sys_org; 
delete from sys_orgclass; 



-- 
-- insert org class
-- 
INSERT INTO `sys_orgclass` (`name`, `title`, `parentclass`, `handler`) 
VALUES ('EE', 'ECONOMIC ENTERPRISE', NULL, NULL);

INSERT INTO `sys_orgclass` (`name`, `title`, `parentclass`, `handler`) 
VALUES ('PROVINCE', 'PROVINCE', NULL, 'province');

INSERT INTO `sys_orgclass` (`name`, `title`, `parentclass`, `handler`) 
VALUES ('MUNICIPALITY', 'MUNICIPALITY', 'PROVINCE', 'municipality');

INSERT INTO `sys_orgclass` (`name`, `title`, `parentclass`, `handler`) 
VALUES ('BARANGAY', 'BARANGAY', 'MUNICIPALITY', 'barangay');


-- 
-- insert org
-- 
INSERT INTO `sys_org` (`objid`, `name`, `orgclass`, `parent_objid`, `parent_orgclass`, `code`, `root`, `txncode`) 
VALUES (@_province_id, @_province_name, 'PROVINCE', NULL, NULL, @_province_pin, 0, NULL);

INSERT INTO `sys_org` (`objid`, `name`, `orgclass`, `parent_objid`, `parent_orgclass`, `code`, `root`, `txncode`) 
VALUES (@_municipal_id, @_municipal_name, 'MUNICIPALITY', @_province_id, 'PROVINCE', @_municipal_pin, 1, NULL);


-- 
-- insert province
-- 
INSERT INTO `province` (
	`objid`, `state`, `indexno`, `pin`, `name`, 
	`governor_name`, `governor_title`, `governor_office`, 
	`assessor_name`, `assessor_title`, `assessor_office`, 
	`treasurer_name`, `treasurer_title`, `treasurer_office`, 
	`address`, `fullname`
) 
VALUES (
	@_province_id, 'DRAFT', @_province_pin, @_province_pin, @_province_name, 
	'-', 'GOVERNOR', 'OFFICE OF THE GOVERNOR', 
	'-', 'PROVINCIAL ASSESSOR', 'OFFICE OF THE PROVINCIAL ASSESSOR', 
	'-', 'PROVINCIAL TREASURER', 'OFFICE OF THE PROVINCIAL TREASURER', 
	upper(concat(@_province_name, ', PHILIPPINES')), 
	upper(concat('PROVINCE OF ', @_province_name))
);


-- 
-- insert municipality
-- 
INSERT INTO `municipality` (
	`objid`, `state`, `indexno`, `pin`, `name`, `parentid`, 
	`mayor_name`, `mayor_title`, `mayor_office`, 
	`assessor_name`, `assessor_title`, `assessor_office`, 
	`treasurer_name`, `treasurer_title`, `treasurer_office`, 
	`address`, `fullname`
) 
VALUES (
	@_municipal_id, 'DRAFT', @_municipal_idx, @_municipal_pin, @_municipal_name, @_province_id, 
	'-', 'MUNICIPAL MAYOR', 'OFFICE OF THE MUNICIPAL MAYOR', 
	'-', 'MUNICIPAL ASSESSOR', 'OFFICE OF THE MUNICIPAL ASSESSOR', 
	'-', 'MUNICIPAL TREASURER', 'OFFICE OF THE MUNICIPAL TREASURER', 
	upper(concat(@_municipal_name, ', PHILIPPINES')), 
	upper(concat('MUNICIPALITY OF ', @_municipal_name))
);
