-- 
-- Adjust business application workflow to include external offices: 
--   
--   * MEO  (Engineering Office)
--   * MPDO (Zoning Office)
--   * MHO  (Health Office)
-- 
-- 
-- BEGIN
-- 

USE `training_etracs_2_5_05_03`;

INSERT INTO `sys_wf_node` (`name`, `processname`, `title`, `nodetype`, `idx`, `salience`, `domain`, `role`, `ui`, `properties`, `tracktime`) VALUES ('meo', 'business_application', 'Engineering', 'state', 1, 0, 'BPLS', 'OBO', '[:]', '[:]', 1);
INSERT INTO `sys_wf_node` (`name`, `processname`, `title`, `nodetype`, `idx`, `salience`, `domain`, `role`, `ui`, `properties`, `tracktime`) VALUES ('mho', 'business_application', 'MHO', 'state', 1, 0, 'BPLS', 'MHO', '[:]', '[:]', 1);
INSERT INTO `sys_wf_node` (`name`, `processname`, `title`, `nodetype`, `idx`, `salience`, `domain`, `role`, `ui`, `properties`, `tracktime`) VALUES ('mpdo', 'business_application', 'MPDO', 'state', 1, 0, 'BPLS', 'MPDO', '[:]', '[:]', 1);
INSERT INTO `sys_wf_node` (`name`, `processname`, `title`, `nodetype`, `idx`, `salience`, `domain`, `role`, `ui`, `properties`, `tracktime`) VALUES ('start-offices', 'business_application', 'Start Offices', 'fork', 0, 0, 'BPLS', NULL, '[:]', '[:]', 0);


UPDATE `sys_wf_node` SET `nodetype` = 'start', `idx` = 0, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'start';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 80, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'assign-assessor';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 90, `salience` = 100, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'assessment';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 92, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'approval';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 94, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'reassessment';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 96, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'payment';
UPDATE `sys_wf_node` SET `nodetype` = 'state', `idx` = 99, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'release';
UPDATE `sys_wf_node` SET `nodetype` = 'end', `idx` = 100, `salience` = 0, `domain` = 'BPLS' WHERE `processname` = 'business_application' AND `name` = 'end';


INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('meo', 'business_application', 'assign-to-me', 'meo', 0, '', '[caption:\"Assign To Me\", icon:\"approve\", visibleWhen:\"#{entity.currenttask?.assignee?.objid == null}\"]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('mho', 'business_application', 'assign-to-me', 'mho', 0, '', '[caption:\"Assign To Me\", icon:\"approve\", visibleWhen:\"#{entity.currenttask?.assignee?.objid == null}\"]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('mpdo', 'business_application', 'assign-to-me', 'mpdo', 0, '', '[caption:\"Assign To Me\", icon:\"approve\", visibleWhen:\"#{entity.currenttask?.assignee?.objid == null}\"]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('meo', 'business_application', 'submit', 'assign-assessor', 1, '', '[caption:\"Submit\",confirm:\"Please ensure that all fees are correct. Proceed?\"]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('mho', 'business_application', 'submit', 'assign-assessor', 1, '', '[caption:\"Submit\", confirm:\"Please ensure that all fees are correct. Proceed?\", visibleWhen:\"#{entity.currenttask?.assignee?.objid != null && entity.currenttask?.enddate == null}\"]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('mpdo', 'business_application', 'submit', 'assign-assessor', 1, '', '[caption:\"Submit\", confirm:\"Please ensure that all fees are correct. Proceed?\", visibleWhen:\"#{entity.currenttask?.assignee?.objid != null && entity.currenttask?.enddate == null}\"]', '', '', '[:]');

INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('start-offices', 'business_application', '', 'meo', 0, 'boolean verify_1 = data.business.address?.type?.matches(\'government|nonlocal\');\r\nboolean verify_2 = data.lobattributes.contains(\'NO_OCBO_PROCESSING\');\r\nreturn (data.apptype == \'NEW\' && verify_1 == false && verify_2 == false);', '[:]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('start-offices', 'business_application', '', 'mho', 0, 'return (data.apptype.toString().matches(\"NEW|RENEW\"));', '[:]', '', '', '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('start-offices', 'business_application', '', 'mpdo', 0, 'return (data.apptype.toString().matches(\"NEW|RENEW\"));', '[:]', '', '', '[:]');

delete from sys_wf_transition where processname = 'business_application' and parentid = 'start';

INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('start', 'business_application', '', 'assign-assessor', -1, 'return (data.apptype.toString().matches(\"ADDITIONAL|RETIRELOB|RETIRE\"));', NULL, NULL, NULL, '[:]');
INSERT INTO `sys_wf_transition` (`parentid`, `processname`, `action`, `to`, `idx`, `eval`, `properties`, `permission`, `caption`, `ui`) VALUES ('start', 'business_application', '', 'start-offices', 0, NULL, NULL, NULL, NULL, '[:]');

-- 
-- DONE 
-- 
