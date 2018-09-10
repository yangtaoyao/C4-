## 本地存储
1.plus.storage.getItem('name');;
2.引用common.js
	myStorage.setItem('name', e.value);;
3.localstorage
	localstorage.setItem('name', e.value);;

是否第一次启动--进入guide页  字符串
plus.storage.setItem("launchFlag", "true");
是否登录  字符串
plus.storage.setItem('isLogin','true');
 
获取前个webview
var currentWebview = plus.webview.currentWebview();
var opener = currentWebview.opener();

2.0加入沉浸式