package jieyou.servlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jieyou.util.RequestUtil;

/**
 * Servlet implementation class TestServlet
 */
@WebServlet("/TestServlet")
public class TestServlet extends HttpServlet {
	 /** 上传目录名*/
    private static final String UPLOAD_DIR = "uploadDir/img/";
    /** 上传临时文件存储目录*/
    private static final String TEMP_UPLOAD_DIR ="uploadDir/temp/";
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public TestServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println(request.getParameter("p1"));
		System.out.println(request.getParameter("p2"));

		// Servlet上下文对象
        ServletContext servletContext = this.getServletConfig().getServletContext();
        // tomcat的项目路径
        String realPath = servletContext.getRealPath(UPLOAD_DIR);
        String tempPath = servletContext.getRealPath(TEMP_UPLOAD_DIR);
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/json;charset=utf-8");

        // tomcat的项目路径，记住要加斜杠
        String fileName = "test.jpg";//保存为什么名字
        String filePath = "E:/"+fileName;//合起来就是完整的文件路径了
       // RequestUtil.writeRequestFile(request, "E:/", "E:/");
//       System.out.println("UploadTestServlet filePath:"+realPath);
//        File realPathFile = new File(filePath);
//        System.out.println(realPathFile.createNewFile());
//        //****** 读写部分  ******//
//        FileOutputStream fos = new FileOutputStream(realPathFile);
//        //传给页面的输出流
//        ServletInputStream sis = request.getInputStream();
//        byte[] b = new byte[1024];
//        int len = 0;;
//        while ((len=sis.read(b))!=-1) {
//        	System.out.println(len);
//            fos.write(b, 0, len);
//        }
//
//        /****** 关闭资源  ******/
//        fos.close();
//        sis.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
