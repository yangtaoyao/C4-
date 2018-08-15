package jieyou.util.func;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;   
  
@ServerEndpoint("/websocket/{username}")  
public class WebSocket {  
  
    private static int onlineCount = 0;  
    private static Map<String, WebSocket> clients = new ConcurrentHashMap<String, WebSocket>();  
    private Session session;  
    private String username;  
      
    @OnOpen  
    public void onOpen(@PathParam("username") String username, Session session) throws IOException { 
    	System.out.println(username);
  
        this.username = username;  
        this.session = session;  
          
        addOnlineCount();  
        clients.put(username, this);  
        System.out.println("已连接");  
    }  
  
    @OnClose  
    public void onClose() throws IOException {  
        clients.remove(username);  
        subOnlineCount();  
    }  
  
    @OnMessage  
    public void onMessage(String message) throws IOException {  
    	System.out.println(message);
        JSONObject jsonTo = JSON.parseObject(message);
        sendMessageTo("给一个人", jsonTo.get("To").toString());  
    }  
  
    @OnError  
    public void onError(Session session, Throwable error) {  
        error.printStackTrace();  
    }  
  
    public void sendMessageTo(String message, String To) throws IOException {  
        // session.getBasicRemote().sendText(message);  
        //session.getAsyncRemote().sendText(message);  
        for (WebSocket item : clients.values()) {  
            if (item.username.equals(To) )  
                item.session.getAsyncRemote().sendText(message);  
        }  
    }  
      
    public void sendMessageAll(String message) throws IOException {  
        for (WebSocket item : clients.values()) {  
            item.session.getAsyncRemote().sendText(message);  
        }  
    }  
      
      
  
    public static synchronized int getOnlineCount() {  
        return onlineCount;  
    }  
  
    public static synchronized void addOnlineCount() {  
        WebSocket.onlineCount++;  
    }  
  
    public static synchronized void subOnlineCount() {  
        WebSocket.onlineCount--;  
    }  
  
    public static synchronized Map<String, WebSocket> getClients() {  
        return clients;  
    }  
} 
