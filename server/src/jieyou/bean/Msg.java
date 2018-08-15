package jieyou.bean;

public class Msg {
	private String uid;
	private String mid;
	private String fmid="";
	private String content = "";
	private String crttime = "";
	private String imgurl="";
	private int floor = 0;
	private int love = 0;

	public String getMid() {
		return mid;
	}

	public void setMid(String mid) {
		this.mid = mid;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCrttime() {
		return crttime;
	}

	public void setCrttime(String crttime) {
		this.crttime = crttime;
	}

	public int getFloor() {
		return floor;
	}

	public void setFlag(int floor) {
		this.floor = floor;
	}

	public int getLove() {
		return love;
	}

	public void setLove(int love) {
		this.love = love;
	}

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public String getFmid() {
		System.out.println(fmid);
		return fmid;
	}

	public void setFmid(String fmid) {
		this.fmid = fmid;
	}

	public String getImgurl() {
		return imgurl;
	}

	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
	}

}
