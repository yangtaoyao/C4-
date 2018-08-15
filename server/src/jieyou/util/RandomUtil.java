package jieyou.util;

public class RandomUtil {
	public static int randomRangeOf(int start , int end) {
		return (int) (start+end*Math.random());
	}
}
