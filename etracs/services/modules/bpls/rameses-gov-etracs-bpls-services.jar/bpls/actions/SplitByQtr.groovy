package bpls.actions;

import com.rameses.rules.common.*;
import bpls.facts.*;

public class SplitByQtr implements RuleActionHandler {
	def request;
	def NS;
	public void execute(def params, def drools) {
		def tf = params.billitem;
		drools.retract( tf );
		request.facts.remove( tf );

		def amount = tf.amount;
		def amtpaid = tf.amtpaid;
		def divisor = NS.round( amount / 4 );

		def facts = [];
		def groupid = createUUID(); 
		for( int i=1; i<=4; i++) { 
			def amt = ((i==4) ? amount : divisor);
			amount = NS.round(amount-divisor);  
			if( amtpaid >= amt ) {
				amtpaid = NS.round(amtpaid - amt);
				continue;
			}	
			def _tf = new BillItem();
			_tf.objid = tf.objid + "_" + i;
			_tf.acctid = tf.acctid;
			_tf.type = tf.type;
			_tf.amount = amt;
			_tf.amtpaid = amtpaid;
			_tf.amtdue = amt - amtpaid;
			_tf.fullamtdue = tf.fullamtdue;
			_tf.total = amt - amtpaid;
			_tf.qtr = i;
			_tf.year = tf.year;
			_tf.expired = false;
			_tf.account = tf.account;
			_tf.lob = tf.lob;
			_tf.receivableid = tf.receivableid;
			_tf.assessmenttype = tf.assessmenttype;
			_tf.application = tf.application;
			_tf.paypriority = tf.paypriority+i;
			_tf.groupid = groupid;
			_tf.totalav = tf.amount; 
			facts << _tf; 
			amtpaid = 0;
		}

		def qtrs = facts.collect{ it.qtr }.findAll{( it )} 
		Number minqtr = qtrs.min{( it )} 
		Number maxqtr = qtrs.max{( it )} 
		if ( minqtr == null ) minqtr = 0; 
		if ( maxqtr == null ) maxqtr = 0; 

		facts.each{
			it.minqtr = minqtr.intValue(); 
			it.maxqtr = maxqtr.intValue(); 
			request.facts << it;
			drools.insert( it );
			amtpaid = 0;
		}
	}

	String createUUID() {
		def encoder = new com.rameses.util.Encoder.MD5Encoder(); 
		return encoder.encode( new java.rmi.server.UID().toString()); 
	}
}
