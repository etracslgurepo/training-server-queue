package bpls.actions;

import com.rameses.rules.common.*;
import bpls.facts.*;

public class ExecuteScript implements RuleActionHandler {

	def request;

	public void execute( def params, def drools ) {
		def script = params.script;
		println 'script object is '+ script.getClass();
		script.eval();
	}

}
