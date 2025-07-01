package bpls.facts;


import java.util.Calendar;
import java.util.Date;

public class QtrDeadline {
    
    Date _deadline;
    int qtr;
    int month;
    int year;
    int day;

    Date _nextdeadline;
    Date _prevdeadline;
    Date _nextbeginqtrdate;
    Date _prevbeginqtrdate; 

    QtrDeadline _min_deadline; 
    QtrDeadline _max_deadline;


    /** Creates a new instance of QtrDeadline */
    public QtrDeadline() {
    }
    
    public QtrDeadline( def d ) {

    }

    public QtrDeadline(int yr, int qtr, int day ) {
        this.year = yr;
        this.qtr = qtr;
        this.month = getQtrMonth(qtr);
        this.day = day;
    }
    
    private static int getQtrMonth( int qtr ) {
        switch(qtr) {
            case 1: 
                return Calendar.JANUARY;
            case 2: 
                return Calendar.APRIL; 
            case 3: 
                return Calendar.JULY; 
            default: 
                return Calendar.OCTOBER;
        }
    }
    
    public QtrDeadline(int yr, int qtr ) {
        this.year = yr;
        this.qtr = qtr;
        this.month = getQtrMonth(qtr);
    }

    
    public Date getBeginQtrDate() {
        return startQtrDate( year, qtr );
    }
    
    private static Date startQtrDate( int year, int qtr ) {
        Calendar cal = Calendar.getInstance();
        int month = 0;
        switch(qtr) {
            case 1: month = Calendar.JANUARY; break;
            case 2: month = Calendar.APRIL; break;
            case 3: month = Calendar.JULY; break;
            default: month = Calendar.OCTOBER;
        }
        cal.set( year, month, 1,  0, 0  );
        return new QtrDeadline().resolveDate( cal.getTime()); 
    }
    
    public void setDeadline(def d) {
        def cal = Calendar.getInstance();
        cal.setTime( d );
        _deadline = resolveDate( cal.getTime());
    }

    public Date getDeadline() {
        return _deadline;        
    }


    public Date getNextdeadline() {
        return _nextdeadline;        
    }
    public void setNextdeadline( def val ) {
        if ( val instanceof java.util.Date ) {
            _nextdeadline = resolveDate( val ); 
            _nextbeginqtrdate = computeBeginQtrDate( _nextdeadline ); 
        } 
        else {
            _nextdeadline = null; 
        }
    }    
    public Date getNextBeginQtrDate() {
        return _nextbeginqtrdate;        
    }
    
    public Date getPrevdeadline() {
        return _prevdeadline;        
    }
    public void setPrevdeadline( def val ) {
        if ( val instanceof java.util.Date ) {
            _prevdeadline = new java.sql.Date( val.getTime() );   
            _prevbeginqtrdate = computeBeginQtrDate( _prevdeadline );    
        } 
        else {
            _prevdeadline = null; 
        }
    } 
    public Date getPrevBeginQtrDate() {
        return _prevbeginqtrdate;        
    }

    Date computeBeginQtrDate( Date value ) {
        if ( value == null ) return null; 

        def formatter = new java.text.SimpleDateFormat('yyyy-MM-dd');
        def arrs = formatter.format( value ).split("-"); 
        def i_month = arrs[1].toInteger(); 

        def str_month = null; 
        if ( i_month <= 3 ) str_month = '01'; 
        else if ( i_month <= 6 ) str_month = '04'; 
        else if ( i_month <= 9 ) str_month = '07'; 
        else if ( i_month <= 12 ) str_month = '10'; 

        def str_date = arrs[0] +'-'+ str_month +'-01';
        def obj_date = formatter.parse( str_date );
        return resolveDate( obj_date ); 
    }

    Date resolveDate( Date value ) {
        if ( value == null ) return null; 
        else if (value instanceof java.sql.Date ) return value; 
        else return new java.sql.Date( value.time ); 
    }

    public void setMinMax( QtrDeadline minDeadline, QtrDeadline maxDeadline ) {
        _min_deadline = minDeadline;
        _max_deadline = maxDeadline; 
    }

    public boolean getFirstItem() {
        def mindate = _min_deadline?.beginQtrDate; 
        if ( mindate ) {
            return (mindate == getBeginQtrDate()); 
        } 
        return false; 
    }
    public boolean getLastItem() {
        def maxdate = _max_deadline?.beginQtrDate; 
        if ( maxdate ) {
            return (maxdate == getBeginQtrDate()); 
        } 
        return false; 
    }

    public int getYearqtr() {
        return "${year}${qtr}".toString().toInteger();
    }

    public void printInfo() {
        def buff = new StringBuilder(); 
        buff.append('QtrDeadline.printInfo ==>>');
        buff.append('  year='+ year).append(', qtr='+ qtr);
        buff.append(', month='+ month).append(', day='+ day);
        buff.append(', beginQtrDate='+ getBeginQtrDate()).append(', deadline='+ _deadline);
        buff.append(', min_qtrbegindate='+ (_min_deadline ? _min_deadline.getBeginQtrDate() : null));
        buff.append(', max_qtrbegindate='+ (_max_deadline ? _max_deadline.getBeginQtrDate() : null));
        buff.append(', isFirstItem='+ getFirstItem()).append(', isLastItem='+ getLastItem());
        println buff.toString();
    }    
}
