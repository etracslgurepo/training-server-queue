[getList]
SELECT * 
FROM vw_rptledger_updated_list
WHERE 1=1 
${filters}
${orderbyclause}