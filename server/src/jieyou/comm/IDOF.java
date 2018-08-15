package jieyou.comm;

public enum IDOF {
	TASK("task",0),USER("user",1),MSG("msg",2);
	private String value;
	private int index;
	
	private IDOF(String value,int index) {
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
