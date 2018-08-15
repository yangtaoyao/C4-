package jieyou.util;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import jieyou.util.func.Handler;

public class FormDataProcessor {
	private String tempPath;
	private String filePath;
	private HttpServletRequest request;
	private List<FileItem> items;
	/** ���ϴ��ļ����Ϊ10M */
	private Long TOTAL_FILE_MAXSIZE = 10000000L;
	/** �����ϴ��ļ����Ϊ10M */
	private int SINGLE_FILE_MAXSIZE = 2 * 1024 * 1024;

	public FormDataProcessor(HttpServletRequest request,String tempPath) {
		this.request=request;
		this.tempPath=tempPath;
	}
	
	public FormDataProcessor process() {
		if (items!=null) {
			return this;
		}
		items = getFormFields(request, tempPath,SINGLE_FILE_MAXSIZE,TOTAL_FILE_MAXSIZE);
		return this;
	}
	
	public String mapToJSON() {
		Map<String, String> map=getFormTextFields("UTF-8");
		return JsonUtil.mapToJSON(map);
	}
	
	public List<FileItem> getFormFields(HttpServletRequest request,String tempPath,
														int SINGLE_FILE_MAXSIZE,long TOTAL_FILE_MAXSIZE) {
		File tempPathFile = new File(tempPath);
		// �ļ�����Ĺ�����
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// ��������ϴ���С
		factory.setSizeThreshold(SINGLE_FILE_MAXSIZE);
		// ����ʱ�ļ��н����ļ�����Ĺ�����
		factory.setRepository(tempPathFile);
		// ����һ���ϴ��ļ��Ĵ�����
		ServletFileUpload upload = new ServletFileUpload(factory);
		// ��������������ܴ�С
		upload.setSizeMax(TOTAL_FILE_MAXSIZE);
		// ����request
		List<FileItem> items = null;
		try {
			items = upload.parseRequest(request);
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		;
		return items;
	}
	
	public Map<String,String> getFormTextFields(String charset){
		Map<String,String> kv=new HashMap<>();
		items.stream().filter(FileItem::isFormField).forEach(item->{
			try {
				kv.put(item.getFieldName(), item.getString(charset));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
		return kv;
	}
	
	public List<FileItem> getFileFields(){
		return items.stream()
				.filter(item->!item.isFormField())
					.collect(Collectors.toList());
	}
	
	public void handleFileFields(Handler handler){
		List<FileItem> items=getFileFields();
		int size=items.size();
		for (int i=0;i<size;++i) {
			handler.handle(items.get(i), i);
		}
	}

	public String getTempPath() {
		return tempPath;
	}

	public String getFilePath() {
		return filePath;
	}

	public FormDataProcessor setFilePath(String filePath) {
		this.filePath = filePath;
		return this;
	}

	public List<FileItem> getItems() {
		return items;
	}

	public Long getTOTAL_FILE_MAXSIZE() {
		return TOTAL_FILE_MAXSIZE;
	}


	public int getSINGLE_FILE_MAXSIZE() {
		return SINGLE_FILE_MAXSIZE;
	}

	
	public FormDataProcessor setTotalFileMaxsize(long TOTAL_FILE_MAXSIZE) {
		this.TOTAL_FILE_MAXSIZE=TOTAL_FILE_MAXSIZE;
		return this;
	}

	public FormDataProcessor setSingleFileMaxsize(int SINGLE_FILE_MAXSIZE) {
		this.SINGLE_FILE_MAXSIZE=SINGLE_FILE_MAXSIZE;
		return this;
	}
}
