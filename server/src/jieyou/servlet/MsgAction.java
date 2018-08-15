package jieyou.servlet;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import jieyou.bean.DataWrapper;
import jieyou.bean.Msg;
import jieyou.bean.User;
import jieyou.comm.IDOF;
import jieyou.dao.Dao;
import jieyou.util.DateTimeUtil;
import jieyou.util.FileUtil;
import jieyou.util.FormDataProcessor;

/**
 * Servlet implementation class MsgAction
 */
@WebServlet("/MsgAction")
public class MsgAction extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MsgAction() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String action = request.getParameter("action");

		User user = (User) request.getSession().getAttribute("user");
		DataWrapper res = new DataWrapper();
		res.setSuc(1);
		if (user != null) {
			if ("publish".equals(action.trim())) {
				String fmid = request.getParameter("fmid");
				Msg msg = publish(request, fmid == null ? "" : fmid);
				msg.setCrttime(DateTimeUtil.getDateTime());
				msg.setUid(user.getUid());
				Dao.publishMsg(msg);
				res.setData(msg);
			} else if ("delete".equals(action)) {
				String mid = request.getParameter("mid");
				boolean rs = Dao.deleteMsg(user.getUid(), mid);
				if (!rs) {
					res.setSuc(0);
				}
			} else if ("love".equals(action)) {
				String mid = request.getParameter("mid");
				Dao.loveMsg(mid,user.getUid());
			}
		} else {
			res.setSuc(0);
		}

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

	private Msg publish(HttpServletRequest request, String fmid) {
		String root = Dao.root + "msg/";
		FileUtil.notExistCreate(root);
		String tempPath = root + "temp";
		FormDataProcessor processor = new FormDataProcessor(request, tempPath);
		String json = processor.process().mapToJSON();

		Msg msg = JSON.parseObject(json, Msg.class);
		String mid = Dao.generateId(IDOF.MSG);
		msg.setMid(mid);
		msg.setFmid(fmid);

		StringBuilder imgurl = new StringBuilder();
		processor.handleFileFields((item, i) -> {
			String fileName = item.getName();
			if (!fileName.trim().isEmpty()) {
				String ext = fileName.substring(fileName.lastIndexOf("."));
				String relUrl = "msg" + i + ext;
				imgurl.append(relUrl + ";");
				File file = FileUtil.newFile(root + mid + "/" + relUrl);
				try {
					item.write(file);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		});

		msg.setImgurl(imgurl.toString());
		return msg;
	}

}
