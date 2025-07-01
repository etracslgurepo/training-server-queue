package bpls.facts;

public class BusinessInfo {

    LOB	lob;
    BPApplication application;

    String objid;
    String name;
    String stringvalue;
    double decimalvalue;
    boolean booleanvalue;
    int intvalue;
    int year;   //this is for late renewal support
    int qtr;    //this is for qtr support for LGUs who report qtr gross for new business.
    

    /** Creates a new instance of BusinessInfo */
    public BusinessInfo() {
    }
    
    public BusinessInfo(String datatype, Object value) {
        if ( value == null ) return; 

        String _datatype = (datatype == null ? "string" : datatype.toLowerCase());
        if ( _datatype.equals("decimal") ) { 
            if ( value instanceof Number ) {
                decimalvalue = ((Number) value).doubleValue();
            } else {
                decimalvalue = new BigDecimal( value.toString()).doubleValue();   
            }
        }
        else if ( _datatype.equals("integer")) {
            if ( value instanceof Number ) {
                intvalue = ((Number) value).intValue();
            } else {
                intvalue = new BigDecimal( value.toString()).intValue();   
            }
        }
        else if ( _datatype.equals("boolean")) {
            booleanvalue = value.toString().toLowerCase().trim().matches("true|1"); 
        }
        else if ( _datatype.startsWith("string")) {
            stringvalue = value.toString(); 
        } 
    }


    double previousAV; 

    public void loadPreviousAV() {
        previousAV = 0.0;

        if ( !application ) return; 

        def dynaDB = application.dyna_ADB;
        def em = dynaDB.lookup('business_application_info');

        def previnfo = em.findPreviousAV([ 
            applicationid: application.objid, 
            attributeid: name, 
            lobid: lob.lobid
        ]);

        if ( previnfo?.av ) {
            previousAV = previnfo.av; 
        }
    }
}
