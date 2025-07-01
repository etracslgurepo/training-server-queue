package bpls.facts;

public class BusinessLocation {
	
	String type;
	String barangayid;

	public BusinessLocation() {
	}

	public BusinessLocation(a) {
		this.type = a.type;
		if(a.type == 'local') type = 'owned';
		if(a.barangay?.objid) {
			barangayid = a.barangay.objid	
		}
	}

	String toString() {
		def buff = new StringBuilder(); 
		buff.append( super.toString()).append(" ["); 
		buff.append("type=").append( this.type ).append(", "); 
		buff.append("barangayid=").append( this.barangayid ); 
		buff.append("]"); 
		return buff.toString();
	}
}