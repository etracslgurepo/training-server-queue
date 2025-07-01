package bpls.facts;

import java.math.BigDecimal;
import java.text.DecimalFormat;

public class Payment {
    
    String option = "FULLYEAR";       
    double amtpaid;
    int year;
    int qtr;    

    private double balance;

    
    /** Creates a new instance of Payment */
    public Payment(def m) {
        option = m.option;
        if ( m.qtr ) {
            qtr = m.qtr;  
        }
        if(m.amount) {
            //amtpaid = m.amount;
            balance = m.amount;
        }  

        if ( m.year ) {
            year = m.year; 
        }
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        DecimalFormat format = new DecimalFormat("0.00");
        String s = format.format(balance); 
        this.balance = (new BigDecimal(s)).doubleValue();
    }
    
    public int getYearqtr() {
        return "${year}${qtr}".toString().toInteger();
    }

    void printInfo() {
        def buff = new StringBuilder();
        buff.append("\n\n"); 
        buff.append("=== Payment.printInfo ==="); 
        buff.append(">> option: " + this.option);
        buff.append(">> yearqtr: " +  getYearqtr());
        buff.append(">> year: " + this.year);
        buff.append(">> qtr: " + this.qtr);
        buff.append(">> amtpaid: " + this.amtpaid);
        buff.append(">> balance: " + getBalance());
        buff.append("\n\n");
        println buff.toString();        
    }

}
