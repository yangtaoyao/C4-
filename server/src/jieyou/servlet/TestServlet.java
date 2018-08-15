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
	 /** �ϴ�Ŀ¼��*/
    private static final String UPLOAD_DIR = "uploadDir/img/";
    /** �ϴ���ʱ�ļ��洢Ŀ¼*/
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

		// Servlet�����Ķ���
        ServletContext servletContext = this.getServletConfig().getServletContext();
        // tomcat����Ŀ·��
        String realPath = servletContext.getRealPath(UPLOAD_DIR);
        String tempPath = servletContext.getRealPath(TEMP_UPLOAD_DIR);
        request.setCharacterEncoding("utf-8");
        response.setContentType("text/json;charset=utf-8");

        // tomcat����Ŀ·������סҪ��б��
        String fileName = "test.jpg";//����Ϊʲô����
        String filePath = "E:/"+fileName;//�����������������ļ�·����
       // RequestUtil.writeRequestFile(request, "E:/", "E:/");
//       System.out.println("UploadTestServlet filePath:"+realPath);
//        File realPathFile = new File(filePath);
//        System.out.println(realPathFile.createNewFile());
//        //****** ��д����  ******//
//        FileOutputStream fos = new FileOutputStream(realPathFile);
//        //����ҳ��������
//        ServletInputStream sis = request.getInputStream();
//        byte[] b = new byte[1024];
//        int len = 0;;
//        while ((len=sis.read(b))!=-1) {
//        	System.out.println(len);
//            fos.write(b, 0, len);
//        }
//
//        /****** �ر���Դ  ******/
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
