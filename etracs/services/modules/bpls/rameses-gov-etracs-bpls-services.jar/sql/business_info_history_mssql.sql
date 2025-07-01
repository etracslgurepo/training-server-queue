[getLobAttribute]
SELECT DISTINCT 
	lob_name AS lobname, attribute_name AS attrname
FROM business_application_info 
WHERE businessid = $P{businessid}
ORDER BY lob_name

[getYears]
SELECT DISTINCT TOP 5 appyear 
FROM business_application 
WHERE business_objid = $P{businessid} 
ORDER BY appyear DESC 

[getValues]
SELECT 
	bai.lob_name AS lobname, bai.attribute_name AS attrname, ba.appyear, 
	bai.decimalvalue, bai.intvalue, bai.stringvalue, bai.boolvalue 
FROM 
	( 
		SELECT DISTINCT TOP 5 
			appyear, business_objid 
		FROM business_application 
		WHERE business_objid = $P{businessid} 
		ORDER BY appyear DESC 
	)tmp 
	INNER JOIN business_application ba ON (ba.business_objid = tmp.business_objid AND ba.appyear = tmp.appyear) 
	INNER JOIN business_application_info bai on bai.applicationid = ba.objid 
ORDER BY bai.lob_name, bai.attribute_name, ba.appyear 
