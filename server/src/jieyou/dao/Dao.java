package jieyou.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import jieyou.bean.Msg;
import jieyou.bean.Task;
import jieyou.bean.User;
import jieyou.comm.IDOF;
import jieyou.comm.TASKSTATUS;
import jieyou.comm.UserStatus;
import jieyou.util.DBUtil;
import jieyou.util.DateTimeUtil;
import jieyou.util.RandomUtil;

public class Dao {
	private static final int LIMIT_PAGE = 10000;
	public static final String root = "E:/STSWorkSpace/jieyou/WebContent/resource/img/";

	/******************** 用户操作 ****************************/
	/**
	 * 登录功能实现
	 * 
	 * @param id
	 * @param pwd
	 * @return
	 */
	public static User login(String id, String pwd) {
		String sql = "select * from user where uid=%s;";
		sql = String.format(sql, id);
		ResultSet rs = DBUtil.query(sql);
		User user = new User();
		try {
			if (rs == null) {
				return null;
			}

			if (rs.next()) {
				user = (User) DBUtil.parse(rs, User.class);
			}

			if (user.checkPwd(pwd)) {
				return user;
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			DBUtil.close();
		}
		return null;
	}

	/**
	 * 注册功能
	 * 
	 * @param user
	 * @return
	 */
	public static boolean register(User user) {
		DBUtil.insertObject(user, User.class, IDOF.USER);
		return true;
	}

	/**
	 * 更新用户的登录状态
	 * 
	 * @param uid
	 * @param status
	 */
	public static void updateUserStatus(String uid, UserStatus status) {
		update(IDOF.USER, "status", status.getValue(), uid);
	}

	/******************** 任务操作 ****************************/
	/**
	 * 发布任务
	 * 
	 * @param task
	 */
	public static void publishTask(Task task) {
		try {
			DBUtil.insertObject(task, Task.class, IDOF.TASK);
		} finally {
			DBUtil.close();
		}
	}

	/**
	 * 删除任务
	 * 
	 * @param currentUid
	 * @param tid
	 * @param uidOfTask
	 * @return
	 */
	public static boolean deleteTask(String currentUid, String tid) {
		return deleteOf(IDOF.TASK, currentUid, tid);
	}

	/**
	 * 获取热门任务
	 * 
	 * @return
	 */
	public static ArrayList<Object> getHot(int start, int limit) {
		ArrayList<Object> tasks;
		ResultSet rs = DBUtil.getLimitNum(IDOF.TASK.getValue(), "countaccess", start, limit);
		try {
			tasks = DBUtil.toArrayList(rs);
		} finally {
			DBUtil.close();
		}
		return tasks;
	}

	/**
	 * 获取已经完成的任务列表
	 * 
	 * @param uid
	 * @return
	 */
	public static ArrayList<Object> getFinishedTask(String uid) {
		String sql = "select * from tu natural join task using mid where uid='%s' and status=2";
		sql = String.format(sql, uid);

		ResultSet rs = DBUtil.query(sql);
		return DBUtil.toArrayList(rs);
	}

	/**
	 * 获取正在进行的任务列表
	 * 
	 * @param uid
	 * @return
	 */
	public static ArrayList<Object> getProcessingTask(String uid) {
		String sql = "select * from  task where uid='%s'";
		sql = String.format(sql, uid);

		ResultSet rs = DBUtil.query(sql);
		return DBUtil.toArrayList(rs);
	}

	/**
	 * 获取发布的任务
	 * 
	 * @param uid
	 * @return
	 */
	public static ArrayList<Object> getPublishTask(String uid) {
		String sql = "select * from task where uid='%s'";
		sql = String.format(sql, uid);

		ResultSet rs = DBUtil.query(sql);
		return DBUtil.toArrayList(rs);
	}

	/**
	 * 接受任务
	 * 
	 * @param uid
	 * @param mid
	 */
	public static void recieveTask(String uid, String mid) {
		String sql = "insert into tu values('%s','%s',0)";
		try {
			DBUtil.insert(String.format(sql, uid, mid));
		}finally {
			DBUtil.close();
		}
	}

	/**
	 * 关键字搜索
	 * 
	 * @param key
	 * @return
	 */
	public static ArrayList<Object> searchTask(String key) {
		ArrayList<Object> result = new ArrayList<>();

		String sql = "select * from task where label like '%%%s%%' or content like '%%%s%%'";
		sql = String.format(sql, key, key);

		ResultSet rs = DBUtil.query(sql);

		try {
			result = DBUtil.toArrayList(rs);
		} finally {
			DBUtil.close();
		}
		return result;
	}

	/**
	 * 访问任务
	 * 
	 * @param tid
	 */
	public static void accessTask(String tid) {
		String sql = "update task set countaccess=countaccess+1 where tid='%s'";
		sql = String.format(sql, tid);
		try {
			DBUtil.update(sql);
		}finally {
			DBUtil.close();
		}
	}

	/**
	 * 更新任务的状态
	 * 
	 * @param tid
	 * @param status
	 */
	public static void updateTaskStatus(String uid, String tid, TASKSTATUS status) {
		String sql = "update task set status=%s where tid='%s' and uid=%s";
		sql = String.format(sql, status.getIndex(), tid, uid);
		try {
			DBUtil.update(sql);
		} finally {
			DBUtil.close();
		}
	}

	/******************** 动态操作 ****************************/
	/**
	 * 动态异步刷新
	 * 
	 * @param uid
	 * @param start
	 * @return
	 */
	public static ArrayList<Object> nextMsgPage(String uid, int start) {
		ArrayList<Object> msgs;
		ResultSet rs = DBUtil.getLimitNum("msg", "crttime", start, Dao.LIMIT_PAGE);
		;
		try {
			msgs = DBUtil.toArrayList(rs);
		} finally {
			DBUtil.close();
		}
		return msgs;
	}

	/**
	 * 发布动态
	 * 
	 * @param msg
	 */
	public static void publishMsg(Msg msg) {
		msg.setMid(Dao.generateId(IDOF.MSG));
		try {
			DBUtil.insertObject(msg, Msg.class, IDOF.MSG);
		} finally {
			DBUtil.close();
		}
	}

	/**
	 * 删除动态
	 * 
	 * @param currentUid
	 * @param mid
	 * @param uidOfMsg
	 * @return
	 */
	public static boolean deleteMsg(String currentUid, String mid) {
		return deleteOf(IDOF.MSG, currentUid, mid);
	}

	/**
	 * 喜欢动态
	 * 
	 * @param mid
	 */
	public static void loveMsg(String mid,String uid) {
		String sqlI="insert into love values('%s','%s')";
		String sql = "update %s set %s=%s where %sid='%s'";
		sql = String.format(sql, "msg", "love", "love+1", "m", mid);
		try {
			DBUtil.update(sql);
			DBUtil.insert(String.format(sqlI, uid,mid));
		} finally {
			DBUtil.close();
		}
	}

	/**
	 * 评论动态
	 * 
	 * @param mid
	 * @param msg
	 */
	public static void commentMsg(String mid, Msg msg) {
		msg.setFmid(mid);
		msg.setMid(Dao.generateId(IDOF.MSG));
		try {
			DBUtil.insertObject(msg, Msg.class, IDOF.MSG);
		} finally {
			DBUtil.close();
		}
	}

	/************************** 抽象工具方法 ***************************************/

	public static boolean deleteOf(IDOF type, String currentUid, String id) {
		String sql = "delete from %s where %sid='%s' and uid=%s";
		sql = String.format(sql, type.getValue(), type.getValue().substring(0, 1), id, currentUid);
		try {
			return DBUtil.update(sql);
		} finally {
			DBUtil.close();
		}
	}

	public static void update(User user) {
		try {
			DBUtil.update(user, "user", "uid=" + user.getUid());
		} finally {
			DBUtil.close();
		}
	}

	public static void update(IDOF type, String col, int sqlValue, String id) {
		String sql = "update %s set %s=%s where %sid='%s'";
		sql = String.format(sql, type.getValue(), col, sqlValue, type.getValue().substring(0, 1), id);
		DBUtil.update(sql);
		DBUtil.close();
	}

	public static void update(IDOF type, String col, String sqlValue, String id) {
		String sql = "update %s set %s='%s' where %sid='%s'";
		sql = String.format(sql, type.getValue(), col, sqlValue, type.getValue().substring(0, 1), id);
		try {
			DBUtil.update(sql);
		} finally {
			DBUtil.close();
		}
	}

	public static void randomClear(Map<String, ?> map, int limit) {
		ArrayList<String> keys = map.keySet().stream().collect(Collectors.toCollection(ArrayList<String>::new));
		for (int i = 0; i < limit; ++i) {
			keys.remove(RandomUtil.randomRangeOf(0, keys.size() + 1));
		}
	}

	public static String generateId(IDOF type) {
		int next = 0;
		String sql = "select max(%sid) from %s;";
		sql = String.format(sql, type.getValue().substring(0, 1), type.getValue());
		ResultSet rs = DBUtil.query(sql);
		try {
			if (rs.next()) {
				String value = rs.getString(1);
				next = 0;
				if (value != null)
					next = Integer.parseInt(value) + 1;
			}
		} catch (NumberFormatException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			DBUtil.close();
		}
		return String.format("%020d", next);
	}
}
