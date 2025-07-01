package treasury.facts;

import enterprise.facts.Org;

public abstract class LGU extends Org {

	public abstract String getOrgClass();

	String toString() {
		def buff = new StringBuilder(); 
		buff.append( super.toString()).append(" ["); 
		buff.append("orgid=").append( this.orgid ).append(", "); 
		buff.append("orgclass=").append( this.getOrgClass()); 
		buff.append("]"); 
		return buff.toString();
	}
}
