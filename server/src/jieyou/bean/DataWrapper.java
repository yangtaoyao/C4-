package jieyou.bean;

public class DataWrapper {
	private Object data;
	//��¼���� 0ʧ�� 1�ɹ�
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
