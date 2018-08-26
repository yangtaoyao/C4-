mui.init();
//初始化单页view
//var viewApi = mui('#app').view({
//	defaultPage: '#login'
//});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if(self.activeP == "login") {
		var viewApi = mui('#app').view({
			defaultPage: '#login'
		});
	} else {
		var viewApi = mui('#app').view({
			defaultPage: '#register'
		});
	}
	plus.navigator.setFullscreen(false);
	// 设置系统状态栏背景
	plus.navigator.setStatusBarBackground('#efeff4');
	(function($) {
		//处理view的后退与webview后退
		var oldBack = $.back;
		$.back = function() {

			if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
				viewApi.back();
			} else { //执行webview后退
				oldBack();
			}
		};
		//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
		//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
		//		view.addEventListener('pageBeforeShow', function(e) {
		//			//				console.log(e.detail.page.id + ' beforeShow');
		//		});
		//		view.addEventListener('pageShow', function(e) {
		//			//				console.log(e.detail.page.id + ' show');
		//		});
		//		view.addEventListener('pageBeforeBack', function(e) {
		//			//				console.log(e.detail.page.id + ' beforeBack');
		//		});
		//		view.addEventListener('pageBack', function(e) {
		//			//				console.log(e.detail.page.id + ' back');
		//		});

	})(mui);
	/*授权登录*/
	var auths = null;
	// 扩展API加载完毕，现在可以正常调用扩展API
	plus.oauth.getServices(function(services) {
		auths = services;
		console.log("auths:" + JSON.stringify(auths));

	}, function(e) {
		console.log("获取分享服务列表失败：" + e.message + " - " + e.code);
	});

	document.getElementById("qqlogin").addEventListener('tap', function() {
		if(this.innerText == "登录") {
			this.innerText = "注销"
			authLogin();
			//authUserInfo();

		} else {
			this.innerText = "登录";
			authLogout();

		}

	})
	// 登录操作
	function authLogin() {
		var s = auths[1];
		if(!s.authResult) {
			s.login(function(e) {
				console.log(JSON.stringify(s.authResult));
				console.log("登录认证成功！");
				authUserInfo();
			}, function(e) {
				console.log("登录认证失败！");
			}, {
				appid: "1107692057", // 应用的appid
				appkey: "5QMbnUGkzKQ2xTNl",
				scope: "snsapi_userinfo" // 授权获取用户信息
			});
		} else {
			console.log("已经登录认证！");
		}
	}
	// 注销所有登录授权认证服务
	function authLogout() {
		for(var i in auths) {
			var s = auths[i];
			if(s.authResult) {
				s.logout(function(e) {
					console.log("注销登录认证成功！");
				}, function(e) {
					console.log("注销登录认证失败！");
				});
			}
		}
	}

	// 获取登录用户信息操作
	function authUserInfo() {
		var s = auths[1];
		if(!s.authResult) {
			console.log("未登录授权！");
		} else {
			s.getUserInfo(function(e) {
				console.log("获取用户信息成功：" + JSON.stringify(s.userInfo));
			}, function(e) {
				console("获取用户信息失败：" + e.message + " - " + e.code);
			});
		}
	}

	// 添加用户手机号信息
	function addPhoneNumber() {
		var s = auths[1];
		if(!s.authResult) {
			console.log("未登录授权！");
		} else {
			s.addPhoneNumber(function(e) {
				console.log("添加用户手机号信息成功！");
			}, function(e) {
				console.log("添加用户手机号信息失败：" + e.message + " - " + e.code);
			});
		}
	}

	/*获取验证码*/
	mui("body").on('tap', ".getIdentCode", function() {
		mui.toast("获取验证码");
		var a = 60;
		var thisNode = this;
		thisNode.innerText = a + 's';
		thisNode.style.color = "#999999";
		a--;
		var interval = setInterval(function() {
			thisNode.innerText = a + 's';
			//console.log("修改"+thisNode.innerText);
			a--;
			if(a < -1) {
				clearInterval(interval);
				thisNode.innerText = "获取验证码";
				thisNode.style.color = "#007aff";
			}
		}, 1000);
	})

	mui("body").on('tap', ".mui-btn-primary", function() {
		mui(this).button('loading');
		setTimeout(function() {
			mui(this).button('reset');
		}.bind(this), 2000);

		var data = {
			type: 0,
			passWord: '',
			phoneNumber: '',
			identiCode: '',
		}
	});
	document.addEventListener('goto_login', function(event) {
		var viewApi = mui('#app').view({
			defaultPage: '#login'
		});
	});
	document.addEventListener('goto_resgiter', function(event) {
		var viewApi = mui('#app').view({
			defaultPage: '#login'
		});
	});

})