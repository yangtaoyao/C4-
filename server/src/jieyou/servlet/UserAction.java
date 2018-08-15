package jieyou.servlet;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import jieyou.bean.DataWrapper;
import jieyou.bean.User;
import jieyou.comm.IDOF;
import jieyou.dao.Dao;
import jieyou.util.FileUtil;
import jieyou.util.FormDataProcessor;
import jieyou.util.RequestUtil;

/**
 * Servlet implementation class ActionServlet
 */
@WebServlet("/ActionServlet")
public class UserAction extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UserAction() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		String action = request.getParameter("action");
		User user = (User) request.getSession().getAttribute("user");

		DataWrapper res = new DataWrapper();
		res.setSuc(1);
		if (user != null) {
			if ("changeInfo".equals(action.trim())) {
				String nickname=request.getParameter("nickname");
				String birthday=request.getParameter("birthday");
				String tel=request.getParameter("tel");
				user.setBirthday(birthday);
				user.setTel(tel);
				user.setNickname(nickname);
				System.out.println(JSON.toJSONString(user));
				Dao.update(user);
			} else if ("changePwd".equals(action)) {
				String pwd = (String) request.getAttribute("pwd");
				Dao.update(IDOF.USER, "pwd", pwd, user.getUid());
			} else if ("getTaskInfo".equals(action)) {
				String category = (String) request.getParameter("category");
				if ("0".equals(category)) {
					ArrayList<Object> rs = Dao.getPublishTask(user.getUid());
					System.out.println(rs.size());
					res.setData(rs);
				} else if ("1".equals(category)) {
					ArrayList<Object> rs = Dao.getProcessingTask(user.getUid());
					res.setData(rs);
				} else if ("2".equals(category)) {
					ArrayList<Object> rs = Dao.getFinishedTask(user.getUid());
					res.setData(rs);
				} else {
					res.setSuc(0);
				}
			} else if ("head".equals(action)) {
				String op = request.getParameter("op");
				if ("get".equals(op)) {

				} else if ("update".equals(op)) {
					uploadUserHead(request, user.getUid());
				}
			}
		}else {
			res.setSuc(0);
		}
		response.getWriter().println(JSON.toJSONString(res));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	private void uploadUserHead(HttpServletRequest request, String uid) {
		String root = Dao.root + "user/" + uid + "/";
		FileUtil.notExistCreate(root);
		String tempPath = root + "temp";
		FormDataProcessor processor = new FormDataProcessor(request, tempPath);

		StringBuilder imgurl = new StringBuilder();
		processor.handleFileFields((item, i) -> {
			String fileName = item.getName();
			String ext = fileName.substring(fileName.lastIndexOf("."));
			String relUrl = "head" + ext;
			imgurl.append(relUrl + ";");
			File file = FileUtil.newFile(root + "/" + relUrl);
			try {
				item.write(file);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
	}

}
