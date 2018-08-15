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
import jieyou.bean.Task;
import jieyou.bean.User;
import jieyou.comm.IDOF;
import jieyou.comm.TASKSTATUS;
import jieyou.dao.Dao;
import jieyou.util.DateTimeUtil;
import jieyou.util.FileUtil;
import jieyou.util.FormDataProcessor;

/**
 * Servlet implementation class TaskAction
 */
@WebServlet(asyncSupported = true)
public class TaskAction extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public TaskAction() {
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
			if ("publish".equals(action)) {
				Task task = publishTask(request);
				task.setUid(user.getUid());
				task.setCrtTime(DateTimeUtil.getDateTime());
				Dao.publishTask(task);
				res.setData(task);
				res.setSuc(1);
			} else if ("update".equals(action)) {
				String tid = request.getParameter("tid");
				String status = request.getParameter("status");
				if ("1".equals(status)) {
					Dao.updateTaskStatus(user.getUid(), tid, TASKSTATUS.PROCESSING);
				} else if ("2".equals(status)) {
					Dao.updateTaskStatus(user.getUid(), tid, TASKSTATUS.FINISHED);
				} else {
					res.setSuc(0);
				}
			} else if ("delete".equals(action)) {
				String tid = request.getParameter("tid");
				Dao.deleteMsg(user.getUid(), tid);
			} else if ("search".equals(action)) {
				String key = request.getParameter("key");
				ArrayList<Object> rs = Dao.searchTask(key);
				res.setData(rs);
			} else if ("hot".equals(action)) {
				String pageStart = request.getParameter("pagestart");
				String page = request.getParameter("page");
				try {
					ArrayList<Object> rs = Dao.getHot(Integer.parseInt(pageStart), Integer.parseInt(page));
					res.setData(rs);
				} catch (Exception e) {
					res.setSuc(0);
				}
			} else if ("recieve".equals(action)) {
				String tid = request.getParameter("tid");
				Dao.recieveTask(user.getUid(), tid);
			} else if ("access".equals(action)) {
				String tid = request.getParameter("tid");
				Dao.accessTask(tid);
			} else {
				res.setSuc(0);
			}
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

	private Task publishTask(HttpServletRequest request) {
		String root = Dao.root + "task/";
		FileUtil.notExistCreate(root);
		String tempPath = root + "temp";
		FileUtil.notExistCreate(tempPath);
		FormDataProcessor processor = new FormDataProcessor(request, tempPath);
		String json = processor.process().mapToJSON();

		Task task = JSON.parseObject(json, Task.class);
		String tid = Dao.generateId(IDOF.TASK);
		task.setTid(tid);

		StringBuilder imgurl = new StringBuilder();
		processor.handleFileFields((item, i) -> {
			String fileName = item.getName();
			String ext = fileName.substring(fileName.lastIndexOf("."));
			String relUrl = "task" + i + ext;
			imgurl.append(relUrl + ";");
			File file = FileUtil.newFile(root + tid + "/" + relUrl);
			System.out.println(file.getAbsolutePath());
			try {
				item.write(file);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});

		task.setImgurl(imgurl.toString());
		return task;
	}
}
