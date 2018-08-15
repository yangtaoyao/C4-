package jieyou.util;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Properties;
import java.util.concurrent.locks.ReentrantLock;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.PreparedStatement;
import com.mysql.jdbc.Statement;

import jieyou.bean.Task;
import jieyou.bean.User;
import jieyou.comm.IDOF;

public class DBUtil {
	private static int connCount;
	private static Connection conn;
	private static ReentrantLock lock;
	static {
		lock = new ReentrantLock(true);
	}

	@SuppressWarnings("finally")
	public static Connection getConnection() {
		try {
			lock.lock();
			++connCount;
			if (conn != null) {
				return conn;
			}
			Properties pros = new Properties();
			try (InputStream in = DBUtil.class.getResourceAsStream("db.properties")) {
				pros.load(in);
			} catch (IOException e) {
				e.printStackTrace();
			}
			String driver = pros.getProperty("jdbc.driver");
			String url = pros.getProperty("jdbc.url");
			String username = pros.getProperty("jdbc.username");
			String password = pros.getProperty("jdbc.password");
			 try {
				Class.forName(driver);
			} catch (ClassNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			 /**
			  * web ≥ˆŒ Ã‚
			  */
              /*if (driver != null)
				System.setProperty("jdbc.driver", driver);*/
			try {
				conn = (Connection) DriverManager.getConnection(url, username, password);
			} catch (SQLException e) {
				e.printStackTrace();
				conn = null;
			} finally {
				return conn;
			}
		} finally {
			lock.unlock();
		}
	}

	public static void insert(String sql) {
		getConnection();
		try {
			Statement state = (Statement) getConnection().createStatement();
			state.execute(sql);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@SuppressWarnings("finally")
	public static ResultSet query(String sql) {
		getConnection();
		ResultSet rs = null;
		try {
			Statement state = (Statement) getConnection().createStatement();
			rs = state.executeQuery(sql);
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			return rs;
		}

	}

	public static PreparedStatement prepareSQL(String sql) {
		PreparedStatement ps;
		try {
			ps = (PreparedStatement) getConnection().prepareStatement(sql);
			conn.setAutoCommit(false);
		} catch (SQLException e) {
			e.printStackTrace();
			ps = null;
		}
		return ps;
	}

	public static boolean update(String sql) {
		boolean isDel = true;
		try {
			Statement state = (Statement) getConnection().createStatement();
			isDel = state.executeUpdate(sql) != 0;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			isDel = false;
		}
		return isDel;
	}

	public static void close() {
		try {
			lock.lock();
			--connCount;
			if (conn != null && connCount == 0) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				} finally {
					conn = null;
				}
			}
		} finally {
			lock.unlock();
		}
	}

	public static ResultSet getLimitNum(String table, String col, int start, int end) {
		String sql = "select * from %s  order by %s asc  limit %s,%s";
		sql = String.format(sql, table, col, start, end);
		return DBUtil.query(sql);
	}

	public static void insertObject(Object o, Class<?> clazz, IDOF type) {
		Field[] fields = clazz.getDeclaredFields();
		int size = fields.length;
		Field.setAccessible(fields, true);
		StringBuilder sql = new StringBuilder("insert into ");
		sql.append(type.getValue());
		sql.append(" values(");
		try {

			for (int i = 0; i < size; ++i) {
				Method method = clazz
						.getDeclaredMethod(String.format("get%s", StrUtil.firstLetterToUpperCase(fields[i].getName())));
				method.setAccessible(true);
				System.out.println(method.getName());
				Object value = method.invoke(o);
				if (value instanceof Integer) {
					sql.append(value.toString());
				} else {
					sql.append(String.format("'%s'", value.toString()));
				}
				if (i != size - 1)
					sql.append(",");
			}
			sql.append(")");
			System.out.println(sql);
			DBUtil.insert(sql.toString());
		} catch (NoSuchMethodException | SecurityException | IllegalAccessException | IllegalArgumentException
				| InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			DBUtil.close();
		}
	}

	public static Object parse(ResultSet rs, Class<?> clazz) {
		Object inst = null;
		try {
			inst = clazz.getConstructor().newInstance();

			Field[] fields = clazz.getDeclaredFields();
			int size = fields.length;
			Field.setAccessible(fields, true);
			for (int i = 0; i < size; ++i) {
				String value = rs.getObject(fields[i].getName()).toString();
				fields[i].set(inst, value.toString());
			}
		} catch (IllegalArgumentException | IllegalAccessException | SQLException | InstantiationException
				| InvocationTargetException | NoSuchMethodException | SecurityException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return inst;
	}

	public static ArrayList<Object> toArrayList(ResultSet rs) {
		ArrayList<Object> list = new ArrayList<>();
		try {
			while (rs!=null&&rs.next()) {
				list.add((Task) DBUtil.parse(rs, Task.class));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return list;
	}

	public static void update(Object o, String table, String whereCon) {
		Field[] fields = o.getClass().getDeclaredFields();
		int size = fields.length;
		Field.setAccessible(fields, true);
		StringBuilder sql = new StringBuilder("update " + table + " set ");
		try {
			for (int i = 0; i < size; ++i) {
				sql.append(fields[i].getName());
				sql.append("=");
				Method method = o.getClass()
						.getDeclaredMethod(String.format("get%s", StrUtil.firstLetterToUpperCase(fields[i].getName())));
				method.setAccessible(true);
				Object value = method.invoke(o);
				if (value instanceof Integer) {
					sql.append(value.toString());
				} else {
					sql.append(String.format("'%s'", value.toString()));
				}
				if (i != size - 1)
					sql.append(",");
			}
			sql.append(" ");
			sql.append("where ");
			sql.append(whereCon);
			DBUtil.getConnection();
			DBUtil.update(sql.toString());
		} catch (IllegalArgumentException | IllegalAccessException | NoSuchMethodException | SecurityException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
