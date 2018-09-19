/*
 *
 */
mui.plusReady(function() {
	var Login = myStorage.getItem("isLogin");
	//var logbtnnode=document.getElementsByClassName("logout")[0].children[0];
	//console.log(typeof launch);
	if(Login == "true") {
		wode.isLogin = true;
	} else {
		wode.isLogin = false;
	}

	//var userInfo = myStorage.getItem("userInfo");
	var len = myStorage.getLength();
	for(var i = 0; i < len; i++) {
		var str = JSON.stringify(myStorage.getItemByIndex(i));
		console.log("myStorage:" + str);
	}
})

function goto_perPage() {
	var titleNView = {
    backgroundColor: '#f7f7f7',//导航栏背景色
    titleText: '透明渐变(native模式)',//导航栏标题
    titleColor: '#000000',//文字颜色
    type:'transparent',//透明渐变样式
    autoBackButton: true,//自动绘制返回箭头
    splitLine:{//底部分割线
        color:'#cccccc'
    }
}
	mui.openWindow({
		id: 'index-subpage-wode-personalPage.html',
		url: 'index-subpage-wode-personalPage.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		},
//		styles:{
//		titleNView: titleNView
//		}
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
	if(!wode.isLogin) {
		goto_login();
		return;
	}
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
	if(!wode.isLogin) {
		goto_login();
		return;
	}

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
//账单
function goto_bill() {
	if(!wode.isLogin) {
		goto_login();
		return;
	}
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

function goto_shoucang() {
	if(!wode.isLogin) {
		goto_login();
		return;
	}
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

function goto_pinglun() {
	if(!wode.isLogin) {
		goto_login();
		return;
	}
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
var wode = new Vue({
	el: '#wode',
	data: {
		isLogin: false,
		userInfo: {
			uid: '',
			nickname: '',
			signature: '',
			desc: '',
			sex: '',
			age: '',
			city: '',
			email: '',
			imgUrl: '',
			tel: ''
		}
	},
	computed: {
		isLogout: function() {
			return !this.isLogin;
		}
	}
});

//初始化用户信息
function initInfo() {
	if(!myStorage.getItem('userInfo')) {
		var userInfo = {
			age: 0,
			balance: 0,
			birthday: "",
			city: "",
			credit: 0,
			crttime: "",
			description: "",
			email: "",
			imgUrl: "",
			nickname: "默认昵称",
			openid: "",
			regTel: "",
			sex: "",
			signature: "",
			tel: "",
			uid: ""
		}
	} else {
		var userInfo = JSON.parse(myStorage.getItem('userInfo'));
		wode.userInfo.uid = userInfo.uid;
		if(userInfo.nickname != "") {
			wode.userInfo.nickname = userInfo.nickname;
		}
		if(userInfo.signature != "") {
			wode.userInfo.signature = userInfo.signature;
		}
		if(userInfo.imgUrl != "") {
			wode.userInfo.imgUrl = userInfo.imgUrl;
		}
	}
	myStorage.setItem('userInfo', JSON.stringify(userInfo));
	var len = myStorage.getLength();
	for(var i = 0; i < len; i++) {
		var str = JSON.stringify(myStorage.getItemByIndex(i));
		console.log(str);
	}

	if(myStorage.getItem("isLogin") == "true") {
		wode.isLogin = true;
	} else {
		wode.isLogin = false;
	}
	//console.log(wode.isLogin)
	console.log('wode:initInfo');
}
initInfo();
//获取用户信息
function changeInfo() {

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