package jieyou.servlet;

import java.io.IOException;

import javax.servlet.AsyncContext;
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
import jieyou.util.DateTimeUtil;
import jieyou.util.RequestUtil;

/**
 * Servlet implementation class RegisterServlet
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RegisterServlet() {
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
		AsyncContext asyncContext = request.startAsync();

		String postJson = RequestUtil.getRequestBody(request);
		System.out.println(postJson);
		User user = JSON.parseObject(postJson, User.class);
		user.setUid(Dao.generateId(IDOF.USER));
		user.setCrttime(DateTimeUtil.getDateTime());
		user.setImgUrl(";");
		DataWrapper res = new DataWrapper();
		res.setData(user);
		res.setSuc(1);
		asyncContext.start(() -> {
			Dao.register(user);
			asyncContext.complete();
		});
		response.getWriter().write(JSON.toJSONString(res));
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

}
