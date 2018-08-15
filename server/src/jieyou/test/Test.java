package jieyou.test;

import com.alibaba.fastjson.JSON;

import jieyou.bean.DataWrapper;
import jieyou.bean.Task;
import jieyou.bean.User;
import jieyou.comm.IDOF;
import jieyou.dao.Dao;
import jieyou.util.DBUtil;

public class Test {
	public static void main(String[]args) {
		User user=Dao.login("1", "123456789");
		user.setBalance("100");;
		Dao.update(user);
		user=Dao.login("1", "123456789");
		DataWrapper data=new DataWrapper();
		data.setData(user);
		data.setSuc(0);
		DBUtil.insertObject((Task)JSON.parseObject("{\"uid\":\"1\",\"content\":\"123\",\"countAccess\":0,\"crtTime\":\"2018-10-10 10:10:10\",\"expireTime\":\"2018-10-10 10:10:10\",\"imgurl\":\"task0.jpg;task1.gif;\",\"label\":\"123\",\"price\":123,\"state\":\"0\",\"tid\":\"00000000000000000002\"}",Task.class), Task.class, IDOF.TASK);
		System.out.println("µÇÂ¼³É¹¦"+JSON.toJSONString(data));
		System.out.println(JSON.toJSONString(user));
	}
}
