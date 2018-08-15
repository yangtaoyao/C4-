package jieyou.comm;

public enum TASKSTATUS {
	UNSTART("unstart",0),PROCESSING("processing",1),FINISHED("finished",2);
	private String value;
	private int index;
	
	private TASKSTATUS(String value,int index) {
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
