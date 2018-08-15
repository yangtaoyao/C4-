package jieyou.bean;

import com.alibaba.fastjson.JSON;

public class Task {
	private String uid="";
	private String tid="";
	private String state="0";
	private String label="";
	private String content="";
	private String imgurl="";
	private String price="0";
	private String crtTime="";
	private String expireTime;
	private String finisher="null";
	private String countAccess="0";
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getTid() {
		return tid;
	}
	public void setTid(String tid) {
		this.tid = tid;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getImgurl() {
		return imgurl;
	}
	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
	}
	public String getCrtTime() {
		return crtTime;
	}
	public void setCrtTime(String crtTime) {
		this.crtTime = crtTime;
	}
	public String getExpireTime() {
		return expireTime;
	}
	public void setExpireTime(String expireTime) {
		this.expireTime = expireTime;
	}
	public String getFinisher() {
		return finisher;
	}
	public void setFinisher(String finisher) {
		this.finisher = finisher;
	}
	public int getCountAccess() {
		return Integer.parseInt(countAccess);
	}
	public void setCountAccess(String countAccess) {
		this.countAccess = countAccess;
	}
	
	public int getPrice() {
		return Integer.parseInt(price);
	}
	public void setPrice(String price) {
		this.price = price;
	}
	
	public String toString() {
		return JSON.toJSONString(this);
	}
}
