package jieyou.servlet.com;

import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * session������
 * @author bojiangzhou
 * @date 2016��2��28��
 */
public class SessionListener implements HttpSessionListener, HttpSessionAttributeListener {
    
    //�������ʱ��
    private long addTime;
    
    @Override
    public void sessionCreated(HttpSessionEvent event) {
        System.out.println("session ����");
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
        System.out.println("session ����");
    }

    @Override
    public void attributeAdded(HttpSessionBindingEvent event) {
        System.out.println("������ԣ�"+event.getName());
        //�����Ա����ʱ�򱣴浱ǰʱ��
        addTime = System.currentTimeMillis();
    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent event) {
        System.out.println("�Ƴ����ԣ�"+event.getName());
        //�������Ƴ���ʱ��������Ա���ʱ��
        long removeTime = System.currentTimeMillis();
        long t = (removeTime-addTime)/1000;
        System.out.println("���ݱ���ʱ�䣺"+t+"��");
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent event) {
        System.out.println("�������ԣ�"+event.getName());
    }

}
