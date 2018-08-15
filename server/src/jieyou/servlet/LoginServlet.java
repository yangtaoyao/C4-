package jieyou.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import jieyou.bean.DataWrapper;
import jieyou.bean.User;
import jieyou.dao.Dao;
import jieyou.util.RequestUtil;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String uid=(String)request.getParameter("uid");
		String pwd=(String)request.getParameter("pwd");
		String data=RequestUtil.getRequestBody(request);
		System.out.println(data);
		User user=Dao.login(uid, pwd);
		DataWrapper res=new DataWrapper();
		if(user!=null){
			res.setData(user);
			res.setSuc(1);
			request.getSession().setAttribute("user", user);
		}
		response.getWriter().write(JSON.toJSONString(res));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
