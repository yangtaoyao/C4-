package jieyou.comm;

public enum UserStatus {
	ONLINE("online",0),OFFLINE("offline",1);
	private String value;
	private int index;
	
	private UserStatus(String value,int index) {
		this.value=value;
		this.index=index;
	}
	public String getValue() {
		return value;
	}

	public int getIndex() {
		return index;
	}
}
