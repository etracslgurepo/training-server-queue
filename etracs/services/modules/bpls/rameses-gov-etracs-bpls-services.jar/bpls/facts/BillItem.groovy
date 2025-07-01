package bpls.facts;

import java.util.Date;
import com.rameses.util.*;

public class BillItem {
    
    BPApplication application;
    String objid;
    String acctid;
    BPLedger ledger;
    String type;
    LOB lob;
    String name;
    double amount;
    double  amtpaid;
    double amtdue;
    boolean expired;
    Date deadline;
    double surcharge;
    double interest;
    double discount;
    double total;
    Object account;
    int year;
    int qtr;
    int paypriority;
    int sortorder;
    double balance;
    String receivableid;
    Object surchargeaccount;
    Object interestaccount;
    boolean deleted;
    double fullamtdue;
    String assessmenttype;

    int minqtr;
    int maxqtr;
    String groupid;
    double totalav;


    /** Creates a new instance of BillItem */
    public BillItem() {
    }
    
    public BillItem(def map) {
        if(map.amtpaid==null) map.amtpaid = 0;
        this.acctid = map.account.objid;
        
        this.amount = map.amount;
        this.amtpaid = map.amtpaid;
        this.amtdue = this.amount - this.amtpaid;
        this.fullamtdue = this.amtdue;
        this.total = this.amtdue;
        this.account = map.account;
        this.receivableid = map.objid;
        this.qtr = this.minqtr = this.maxqtr = 0;
        if(map.year) this.year = map.year;
        if(map.iyear) this.year = map.iyear;
        this.type = map.taxfeetype;
        this.assessmenttype = map.assessmenttype;
        this.totalav = this.amount;
        setApplication( null ); 
    }

    public void setApplication( BPApplication app ) {
        this.application = app;
        def appyear = app?.appyear; 
        if ( appyear == null ) appyear = this.year; 
        
        if ( this.type == "TAX" ) {
            this.paypriority = 30 + getYearqtr(); 
            this.sortorder = 1;
        }
        else if ( this.type == "REGFEE" && this.qtr > 0 ) {
            this.paypriority = 30 + getYearqtr(); 
            this.sortorder = 1;
        } 
        else if ( this.type == "REGFEE" ) {
            this.paypriority = 20 + getYearqtr(); 
            this.sortorder = 2;
        }
        else { 
            this.paypriority = 10 + getYearqtr(); 
            this.sortorder = 3; 
        } 

        if ( this.year < appyear ) {
            if ( this.type == "TAX" ) { 
                this.paypriority = 29 + getYearqtr(); 
                this.sortorder = 4; 
            } 
            else if ( this.type == "REGFEE" && this.qtr > 0 ) { 
                this.paypriority = 29 + getYearqtr(); 
                this.sortorder = 4; 
            } 
            else if ( this.type == "REGFEE" ) { 
                this.paypriority = 19 + getYearqtr(); 
                this.sortorder = 5; 
            } 
            else { 
                this.paypriority = 9 + getYearqtr(); 
                this.sortorder = 6; 
            } 
        }
    }

    public Date getFirstdateofyear() {
        Calendar cal = Calendar.getInstance();
        cal.set( this.year, Calendar.JANUARY, 1, 0, 0);
        return cal.getTime();
    }

    public boolean getFirstItem() {
        return ( this.minqtr == 0 || this.minqtr == this.qtr ); 
    }
    public boolean getLastItem() {
        return ( this.maxqtr == 0 || this.maxqtr == this.qtr ); 
    }
    public String getGroupid() {
        return this.groupid; 
    }
    public int getYearqtr() {
        return "${year}${qtr}".toString().toInteger();
    }

    public def toItem() {
        def item = [:]; 
        item.yearqtr = getYearqtr();
        item.year = this.year;
        item.qtr = this.qtr;
        item.minqtr = this.minqtr;
        item.maxqtr = this.maxqtr;
        if( this.lob ) {
            item.lob = [objid: this.lob.objid, name:this.lob.name, assessmenttype: this.lob.assessmenttype ]; 
        }
        item.account = this.account;
        item.taxfeetype = this.type;
        item.amtdue = this.amtdue;
        item.surcharge = this.surcharge;
        item.interest = this.interest;
        item.discount = this.discount;
        item.total = this.total;
        item.paypriority = this.paypriority;

        def _qtr = this.qtr;
        if ( _qtr == 0 ) _qtr = 5;
        item.sortorder = item.yearqtr + this.sortorder;
        item.duedate = this.deadline;
        item.balance = this.balance;
        item.receivableid = this.receivableid;
        //this is the full amtpaid.
        item.amount = this.amount;
        item.amtpaid = this.amtpaid;
        item.interestaccount = this.interestaccount;
        item.surchargeaccount = this.surchargeaccount;
        item.assessmenttype = this.assessmenttype;
        return item;
    }

    public void removeSurcharge() {
        this.surcharge = 0.0; 
        this.surchargeaccount = null; 
        updateTotal(); 
    }

    public void updateTotal() {
        this.total = (this.amtdue + this.surcharge + this.interest) - this.discount; 
    }

    public void printInfo() {
        def buff = new StringBuilder();
        buff.append("\n\n"); 
        buff.append("=== BillItem.printInfo ==="); 
        buff.append(">> amtpaid: " + this.amtpaid);
        buff.append(">> acctid: " + this.acctid);
        buff.append(">> amount: " + this.amount);
        buff.append(">> LOB: " + this.lob);
        buff.append(">> amtpaid: " + this.amtpaid);
        buff.append(">> amtdue: " + this.amtdue);
        buff.append(">> total: " + this.total);
        buff.append(">> account: " + this.account);
        buff.append(">> receivableid: " +  this.receivableid);
        buff.append(">> yearqtr: " +  getYearqtr());
        buff.append(">> year: " +  this.year);
        buff.append(">> qtr: " +  this.qtr);
        buff.append(">> type: " + this.type);
        buff.append(">> paypriority: " + this.paypriority);
        buff.append(">> assessmenttype: " + this.assessmenttype);
        buff.append(">> minqtr: " +  this.minqtr);
        buff.append(">> maxqtr: " +  this.maxqtr);
        buff.append("\n\n");
        println buff.toString();
    }
}
