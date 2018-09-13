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

box-shadow: 0 1px 3px 0px #c8c7cc;

var url = common.url+"task?action=search&key=" + encodeURI(encodeURI(search_vm.input_str).trim());