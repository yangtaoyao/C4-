/*
 *
 */

mui.plusReady(function() {
	var Login = myStorage.getItem("isLogin");
	//var logbtnnode=document.getElementsByClassName("logout")[0].children[0];
	//console.log(typeof launch);
	if(Login == "true") {
		wode.isLogin = true;
		wode.isLogout = false;
	} else {
		wode.isLogin = false;
		wode.isLogout = true;
	}
})

function goto_login() {
	//打开登录页
	mui.openWindow({
		id: 'login02',
		url: 'login02.html',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "fade-in", //页面显示动画，默认为”slide-in-right“；
			duration: 200 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		},
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		},
		extras: {
			activeP: 'login' //扩展参数
		}
	});
}

function goto_assigment() {
	console.log('isLogin:' + myStorage.getItem('isLogin'));
	console.log('wode.isLogin:' + wode.isLogin);
	console.log('wode.isLogout:' + wode.isLogout);
	mui.openWindow({
		id: 'index-subpage-wode-assigment.html',
		url: 'index-subpage-wode-assigment.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		}
	});
}

function goto_purse() {
	mui.openWindow({
		id: 'index-subpage-wode-purse.html',
		url: 'index-subpage-wode-purse.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		}
	});
}

//个人主页原生渐变标题栏
//			var titleNView = {
//				backgroundColor: '#f7f7f7', //导航栏背景色
//				titleText: '个人主页', //导航栏标题
//				titleColor: '#333333', //文字颜色
//				type: 'transparent', //透明渐变样式
//				autoBackButton: true, //自动绘制返回箭头
//				splitLine: { //底部分割线
//					color: '#cccccc'
//				}
//			}
function goto_perPage() {
	mui.openWindow({
		id: 'index-subpage-wode-personalPage.html',
		url: 'index-subpage-wode-personalPage.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		}
	});
}

function goto_perData(event) {
	event.stopPropagation();
	mui.openWindow({
		id: 'perData.html',
		url: 'perData.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		}
	});
}

var wode = new Vue({
	el: '#wode',
	data: {
		isLogin: true,
		isLogout: false,
		userInfo:{
			uid:'',
			data:{
				name:'',
				signature:'',
				desc:'',
				sex:'',
				age:'',
				city:'',
				email:''
			}
		}
	}
});

//更新登录状态
function updateIsLogin(isLogin) {
	wode.isLogin = isLogin;
	wode.isLogout = !isLogin;
	console.log(wode.isLogin)
}

//获取用户信息
function initInfo(){
	wode.userInfo.data.name=myStorage.getItem('name');
	wode.userInfo.data.signature=myStorage.getItem('signature');
}
initInfo();
//获取用户信息
function changeInfo(){
	
}
//获取用户信息
function getInfo() {
	mui.ajax(url + 'user', {
		data: {
			action: 'getInfo',
			uid: '用户id'
		},
		type: 'get', //HTTP请求类型
		timeout: 10000,
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			console.log(res + '' + res.msg);
			if(res.suc < 0) {
				mui.toast('密码登录失败：' + JSON.stringify(res));
				console.log('密码登录失败：' + res.msg);

			} else {
				console.log('密码登录成功：' + JSON.stringify(res));
				mui.toast('密码登录成功：' + res.msg);

			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；        02
			console.log('网络请求错误:' + type);
			if(type == 'timeout') {
				mui.toast('网络请求超时');
			} else {
				mui.toast('网络请求错误');
			}

		}
	});
}