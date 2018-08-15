package jieyou.bean;


public class User {
	private String uid="";
	private String pwd="";
	private String nickname;
	private String imgUrl="";
	private String status="off";
	private String credit="0";
	private String balance="0";
	private String birthday;
	private String tel;
	private String crttime;
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public boolean checkPwd(String pwd) {
		return this.pwd.equals(pwd);
	}
	
	@SuppressWarnings("unused")
	private String getPwd() {
		return pwd;
	}
	
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public String getNickname() {
		return nickname;
	}
	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getCredit() {
		return Integer.parseInt(credit);
	}
	public void setCredit(String credit) {
		this.credit = credit;
	}
	public int getBalance() {
		return Integer.parseInt(balance);
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getCrttime() {
		return crttime;
	}
	public void setCrttime(String crttime) {
		this.crttime = crttime;
	}
	public String getImgUrl() {
		return imgUrl;
	}
	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}
}
