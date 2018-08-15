package jieyou.util;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {
	public static String timeFormatter="HH:mm:ss";
	public static String dateFormatter="yyyy-MM-dd";

	public static String getDateTime() {
		return LocalDate.now().format(DateTimeFormatter.ofPattern(dateFormatter))
				+" "+LocalTime.now().format(DateTimeFormatter.ofPattern(timeFormatter));
	}
}
