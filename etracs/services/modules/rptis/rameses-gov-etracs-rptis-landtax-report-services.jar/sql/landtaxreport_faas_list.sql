[getList]
SELECT * 
FROM vw_faas_list
WHERE 1=1 
${filters}
${orderbyclause}