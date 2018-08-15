package jieyou.bean;

public class DataWrapper {
	private Object data;
	//登录参数 0失败 1成功
	private int suc= 0;
	public int getSuc() {
		return suc;
	}
	public void setSuc(int suc) {
		this.suc = suc;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
}
