package jieyou.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

public class RequestUtil {
	public static String getRequestBody(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer("");
		try (BufferedReader br = new BufferedReader(
				new InputStreamReader((ServletInputStream) request.getInputStream(), "utf-8"))) {
			String temp;
			while ((temp = br.readLine()) != null) {
				sb.append(temp);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return sb.toString();
	}

}
