package jieyou.util;

import java.util.HashMap;
import java.util.Map;

public class JsonUtil {
	public static String mapToJSON(Map<String,String> map) {
		StringBuilder json=new StringBuilder("{}");
		String item="\"%s\":\"%s\"";
		map.entrySet().forEach(entry->{
			int pos=json.length()-1;
			json.insert(pos, String.format(item,entry.getKey(),entry.getValue())+",");
		});
		int size=json.length();
		return json.replace(size-2, size-1, "").toString();
	}
	
	public static void main(String[] args) {
		Map<String,String> map=new HashMap<>();
		map.put("=","1");
		map.put("1", "2");
		System.out.println(JsonUtil.mapToJSON(map));
	}
}
