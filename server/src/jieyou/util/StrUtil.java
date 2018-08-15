package jieyou.util;

public class StrUtil {
	public static String firstLetterToUpperCase(String str) {
		if (str == null || str.isEmpty()) {
			return str;
		}

		char[] ch = str.toCharArray();
		if (ch[0] >= 'a' && ch[0] <= 'z') {
			ch[0] = (char) (ch[0] - 32);
		}
		return new String(ch);
	}
}
