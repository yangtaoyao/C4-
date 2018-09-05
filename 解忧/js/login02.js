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
	} else if(self.activeP == "register") {
		var viewApi = mui('#app').view({
			defaultPage: '#register'
		});
	} else {
		var viewApi = mui('#app').view({
			defaultPage: '#guide'
		});
	}

	plus.navigator.setFullscreen(true);
	// 设置系统状态栏背景
	plus.navigator.setStatusBarBackground('#efeff4');

	//处理view的后退与webview后退
	var first = null;
	mui.back = function() {
		if(!first) {
			first = new Date().getTime();
			/**
			 * 自动消失提示信息
			 * http://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.toast
			 */
			plus.nativeUI.toast("再按一次退出应用");
			setTimeout(function() {
				first = null;
			}, 1000);
		} else {
			if(new Date().getTime() - first < 1000) {
				/**
				 * 退出应用，仅安卓有效；
				 * http://www.html5plus.org/doc/zh_cn/runtime.html#plus.runtime.quit
				 */
				plus.runtime.quit();
			}
		}
	};
	var oldBack = mui.back;
	mui.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			oldBack();
		}
	};

	var view = viewApi.view;
	//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
	//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
	view.addEventListener('pageBeforeShow', function(e) {
		console.log(e.detail.page.id + ' beforeShow');
	});
	view.addEventListener('pageShow', function(e) {
		console.log(e.detail.page.id + ' show');
	});
	view.addEventListener('pageBeforeBack', function(e) {
		console.log(e.detail.page.id + ' beforeBack');
	});
	view.addEventListener('pageBack', function(e) {
		console.log(e.detail.page.id + ' back');
	});

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

	document.getElementById('start').addEventListener('tap', function() {
		//plus.storage.setItem("launchFlag", "true");
		plus.navigator.setFullscreen(false);
		plus.navigator.setStatusBarBackground('#FFFFFF');
		plus.webview.currentWebview().close();
	})
	//	mui("body").on('tap', ".mui-btn-primary", function() {
	//		mui(this).button('loading');
	//		setTimeout(function() {
	//			mui(this).button('reset');
	//		}.bind(this), 2000);
	//	});
	/*页面跳转*/
	//	document.addEventListener('goto_login', function(event) {
	//		var viewApi = mui('#app').view({
	//			defaultPage: '#login'
	//		});
	//	});
	//	document.addEventListener('goto_resgiter', function(event) {
	//		var viewApi = mui('#app').view({
	//			defaultPage: '#login'
	//		});
	//	});

})

var login = new Vue({
	el: '#login',
	data: {
		loginWPsw: {
			phoneNumber: '13763369408',
			password: '123'
		},
		loginWIcode: {
			phoneNumber: '13763369408',
			identiCode: ''
		}
	}
});

//加密
var encrypt = new JSEncrypt();
encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6JbMo802QOZHkyLBc590xa9lHjBwxAU7jbDuUfUUYwxlkLdjPhxfoh+hC2HNeHuD6t975UwBpU9QQ5ewepz/+DiOkVy8fh10NtND6LijYRcKlHT4FoVhPIZV7amX2DAcRssGqRUYK2/ufE6LL3dzz/a8Qw9/i0y4LhdxrZecZ176X+6OOQnRQzKNb2c66aKXSZL7dehZuFFqd/To85r4QJt2la7xarCL3lP1/3Ax3wDwxhKPFTIpuDU1R6r7SfE7By6m1n27ikuFbWQigPr3Gx7xDPy+huTYZh+HlcGgG9dcxMwzzN1Q8fKKfecMZNcyBl4urrF+3k0SI28i3nZr0QIDAQAB');

function submit_login01(e) {
	var thisNode = e.currentTarget;
	if(login.loginWPsw.phoneNumber == '' || login.loginWPsw.password == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 500);
		mui.toast('输入框不能为空');
	} else {
		var pwd = encrypt.encrypt(login.loginWPsw.password);
		console.log("加密后：" + pwd);
		mui(thisNode).button('loading');

		setTimeout(function() {
			plus.storage.setItem("launchFlag", "true");
			plus.navigator.setFullscreen(false);
			plus.navigator.setStatusBarBackground('#FFFFFF');
			plus.webview.currentWebview().close();
		}.bind(thisNode), 3000);
		//mui(thisNode).button('reset');
	}
}

function submit_login02(e) {
	var thisNode = e.currentTarget;
	if(login.loginWIcode.phoneNumber == '' || login.loginWIcode.identiCode == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 1000);
		mui.toast('输入框不能为空');
	} else {

	}
}

//登录页获取验证码
function getIdentCode_login(e) {
	var a = 60;
	var thisNode = e.currentTarget;

	if(login.loginWIcode.phoneNumber == '') {
		mui.toast('手机号不能为空');
	} else {
		mui.ajax('http://59.110.241.117:12001/jieyou/SMS', {
			data: {
				tel: login.loginWIcode.phoneNumber
			},
			type: 'get', //HTTP请求类型
			timeout: 100000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log(res + '' + res.msg);
				if(res.suc < 0) {
					mui.toast(res.msg);
				} else {
					console.log('请求发送验证码成功：' + res.msg);
					thisNode.innerText = a + 's';
					thisNode.style.color = "#999999";
					thisNode.style.disabled = true;
					thisNode.classList.add("mui-disabled");
					a--;
					var interval = setInterval(function() {
						thisNode.innerText = a + 's';
						//console.log("修改"+thisNode.innerText);
						a--;
						if(a < -1) {
							clearInterval(interval);
							thisNode.innerText = "获取验证码";
							thisNode.style.color = "#007aff";
							thisNode.classList.remove("mui-disabled");
						}
					}, 1000);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				mui.toast('网络请求错误')
			}
		});
	}

}
//注册页面获取验证码
function getIdentCode_register(e) {
	var a = 60;
	var thisNode = e.currentTarget;
	thisNode.innerText = a + 's';
	thisNode.style.color = "#999999";
	thisNode.style.disabled = true;
	thisNode.classList.add("mui-disabled");
	a--;
	var interval = setInterval(function() {
		thisNode.innerText = a + 's';
		//console.log("修改"+thisNode.innerText);
		a--;
		if(a < -1) {
			clearInterval(interval);
			thisNode.innerText = "获取验证码";
			thisNode.style.color = "#007aff";
			thisNode.classList.remove("mui-disabled");
		}
	}, 1000);
}