package bpls.facts;

import com.rameses.util.*;
import java.util.*;

public class BPApplication {
    
    def dyna_ADB;

    String objid;
    String orgtype;
    String apptype;
    String txnmode;
    int appyear;
    String appno;
    String purpose;
    int yearstarted;
    Date dateapplied;
    String officetype;
    String permittype;
    
    int appqtr;
    int appmonth;
    int appdate;

    int lastqtrpaid;
    boolean online; 

    String bin;


    /** Creates a new instance of BPApplication */
    public BPApplication() {
    }

    public BPApplication( int yr ) {
        this.appyear = appyear;
    }
     
    public BPApplication( Map app ) {
        if ( !app.appyear ) { 
            throw new Exception("BPApplication Fact error. Please provide an app.appyear");
        }
        if ( app.dtfiled ) {
            app.dateapplied = app.dtfiled; 
        }

        objid = app.objid;
        appno = app.appno;
        appyear = app.appyear;

        if ( app.yearstarted ) {
            this.yearstarted = app.yearstarted;
        }   

        if ( app.dateapplied instanceof Date ) {
            this.dateapplied = app.dateapplied; 
        } 
        else if ( app.dateapplied ) { 
            try {
                def df = new java.text.SimpleDateFormat("yyyy-MM-dd");
                def date_obj = df.parse( app.dateapplied.toString());
                this.dateapplied = new java.sql.Date( date_obj.time ); 
            }
            catch(Throwable t){
                println "ERROR !" + t.message;
            }
        }
        else {
            this.dateapplied = new Date();
        }

        def db = new DateBean( this.dateapplied );
        this.appqtr = db.qtr;
        this.appmonth = db.month;
        this.appqtr = db.qtr;
        this.appdate = db.day;     
           
        apptype = app.apptype;
        txnmode = app.txnmode;
        orgtype = app.business?.orgtype;
        permittype = app.business?.permittype;
        officetype = app.business?.officetype;

        if ( app.lastqtrpaid == null) { 
            app.lastqtrpaid = 0; 
        } 
        lastqtrpaid = app.lastqtrpaid;

        this.online = false; 
        if ( app.onlineapplication?.objid ) {
            this.online = true; 
        }

        bin = app.business?.bin;
    }
}
