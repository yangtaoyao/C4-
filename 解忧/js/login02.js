mui.init();
//初始化单页view
//var viewApi = mui('#app').view({
//	defaultPage: '#guide '
//});

//加密
var encrypt = new JSEncrypt();
encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6JbMo802QOZHkyLBc590xa9lHjBwxAU7jbDuUfUUYwxlkLdjPhxfoh+hC2HNeHuD6t975UwBpU9QQ5ewepz/+DiOkVy8fh10NtND6LijYRcKlHT4FoVhPIZV7amX2DAcRssGqRUYK2/ufE6LL3dzz/a8Qw9/i0y4LhdxrZecZ176X+6OOQnRQzKNb2c66aKXSZL7dehZuFFqd/To85r4QJt2la7xarCL3lP1/3Ax3wDwxhKPFTIpuDU1R6r7SfE7By6m1n27ikuFbWQigPr3Gx7xDPy+huTYZh+HlcGgG9dcxMwzzN1Q8fKKfecMZNcyBl4urrF+3k0SI28i3nZr0QIDAQAB');

//服务器ip
var url = common.url;

//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	if(self.activeP == "login") {
		viewApi = mui('#app').view({
			defaultPage: '#login'
		});
	} else if(self.activeP == "register") {
		viewApi = mui('#app').view({
			defaultPage: '#register'
		});
	} else {
		viewApi = mui('#app').view({
			defaultPage: '#guide'
		});
	}

	//全屏
	plus.navigator.setFullscreen(true);

	/*
	 * 处理view的后退与webview后退与推出应用
	 */
	var first = null;
	var currentWebview = plus.webview.currentWebview();
	var opener = currentWebview.opener();
	var webViewBack = function() {
		plus.navigator.setFullscreen(false);
		plus.webview.close(currentWebview, "zoom-fade-in", 200);

		//更新设置页面登录按钮
		var Webv_setting = plus.webview.getWebviewById("index-subpage-wode-setting.html");
		if(Webv_setting != undefined) {
			Webv_setting.evalJS('updateIslogin("false")');
		}
	};
	var thisApp_close = function() {
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
	mui.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			if(opener == plus.webview.getLaunchWebview()) {
				thisApp_close();
			} else {
				webViewBack();
			}
		}
	};

	var view = viewApi.view;

	/*授权登录*/
	var auths = null;
	// 扩展API加载完毕，现在可以正常调用扩展API
	plus.oauth.getServices(function(services) {
		auths = services;
		console.log("auths:" + JSON.stringify(auths));

	}, function(e) {
		console.log("获取分享服务列表失败：" + e.message + " - " + e.code);
	});

	var qqlogin = document.getElementById("qqlogin");
	if(qqlogin) {
		qqlogin.addEventListener('tap', function() {
			if(this.innerText == "登录") {
				this.innerText = "注销"
				authLogin();
				//authUserInfo();

			} else {
				this.innerText = "登录";
				authLogout();

			}

		})
	}

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

	//跳过
	document.getElementById('start').addEventListener('tap', function() {
		myStorage.setItem("launchFlag", "true");
		plus.navigator.setFullscreen(false);
		plus.navigator.setStatusBarBackground('#FFFFFF');
		mui.toast('欢迎进入解忧');
		plus.webview.currentWebview().close();
	})

	/*页面跳转*/
	//	document.addEventListener('goto_login', function(event) {
	//		var viewApi = mui('#app').view({
	//			defaultPage: '#login'
	//		});
	//	});

})

var login = new Vue({
	el: '#login',
	data: {
		loginWPsw: {
			//15219171826
			phoneNumber: '13763369408',
			password: '123'
		},
		loginWIcode: {
			phoneNumber: '13763369408',
			identiCode: ''
		},
		qqlogin_show: false
	}
});
var register = new Vue({
	el: '#register',
	data: {
		registerWIcode: {
			phoneNumber: '13763369408',
			password: '123',
			identiCode: ''
		}
	}
});
var findPwd = new Vue({
	el: '#findPwd',
	data: {}
});

mui('body').on('tap', '.mui-icon-clear', function() {
	var par = this.parentNode;
	switch(par.children[0].id) {
		case 'loginWPsw_phoneNumber':
			login.loginWPsw.phoneNumber = '';
			break;
		case 'loginWIcode_phoneNumber':
			login.loginWIcode.phoneNumber = '';
			break;
		case 'registerWIcode_phoneNumber':
			register.registerWIcode.phoneNumber = '';
			break;

	}
	//console.log('mui-icon-clear_input:' + par.children[0].innerHTML);
})
/*密码登录*/
function submit_login01(e) {
	var thisNode = e.currentTarget;
	if(login.loginWPsw.phoneNumber == '' || login.loginWPsw.password == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('输入框不能为空');
	} else {
		//保存数据到localStorage
		localStorage_addArrItem('loginWPsw_phoneNumber', login.loginWPsw.phoneNumber);

		var timestamp1 = Date.parse(new Date()) + '';
		var pwd = timestamp1.substring(0, 9) + '_' + login.loginWPsw.password;
		pwd = encrypt.encrypt(pwd);
		pwd = common.urlEncode(pwd);
		console.log('pwd:' + pwd);
		req = {
			id: register.registerWIcode.phoneNumber,
			//id:'10001',
			password: pwd,
			_: timestamp1.substring(0, 9),
			way: 'tel_pwd'
		};

		mui(thisNode).button('loading');
		mui.ajax(url + 'doLogin', {
			data: JSON.stringify(req),
			type: 'post', //HTTP请求类型
			timeout: 20000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log(res + '' + res.msg);
				if(res.suc < 0) {
					if(res.msg == "该用户已经登录") {
						console.log('该用户已经登录：' + JSON.stringify(res));
						mui.toast('密码登录成功!');

						myStorage.setItem("launchFlag", "true");
						myStorage.setItem("isLogin", "true");

						setUserInfo(JSON.parse(myStorage.getItem("userInfo")));
						//跳转首页
						plus.navigator.setFullscreen(false);
						plus.navigator.setStatusBarBackground('#FFFFFF');
						plus.webview.currentWebview().close();
						mui(thisNode).button('reset');
					} else {
						mui.toast('密码登录失败：' + JSON.stringify(res));
						console.log('密码登录失败：' + JSON.stringify(res));
						mui(thisNode).button('reset');
					}

				} else {
					console.log('密码登录成功：' + JSON.stringify(res));
					mui.toast('密码登录成功!');

					myStorage.setItem("launchFlag", "true");
					myStorage.setItem("isLogin", "true");

					setUserInfo(res.data);
					//跳转首页
					plus.navigator.setFullscreen(false);
					plus.navigator.setStatusBarBackground('#FFFFFF');
					plus.webview.currentWebview().close();
					mui(thisNode).button('reset');
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；        02
				console.log('网络请求错误:' + type);
				mui(thisNode).button('reset');
				if(type == 'timeout') {
					mui.toast('网络请求超时');
				} else {
					mui.toast('网络请求错误');
				}

			}
		});
	}
}

//登录成功设置信息
function setUserInfo(data) {
	if(data!=null||data!=undefined){
		myStorage.setItem("userInfo", JSON.stringify(data));
	}
	
	//传值到我的页面
	var Webv_wode = plus.webview.getWebviewById("index-subpage-wode.html");
	Webv_wode.evalJS('initInfo()');
	
	var Webv_setting = plus.webview.getWebviewById("index-subpage-wode-setting.html");
	console.log('updateIslogin before')
	if(Webv_setting != undefined) {
		console.log('updateIslogin before')
		Webv_setting.evalJS('updateIslogin("true")');
	}
	
}

//登录页获取验证码
function getIdentCode_login(e) {
	var thisNode = e.currentTarget;
	var a = 60;
	if(login.loginWIcode.phoneNumber == '') {
		mui.toast('手机号不能为空');
	} else {
		//保存数据到localStorage
		localStorage_addArrItem('loginWIcode_phoneNumber', login.loginWIcode.phoneNumber);

		//倒计时
		var interval = countDown(thisNode, a);

		mui.ajax(url + 'SMS', {
			data: {
				tel: login.loginWIcode.phoneNumber,
				action: 'get'
			},
			type: 'get', //HTTP请求类型
			timeout: 20000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log('res:' + res.suc);

				if(res.suc < 0) {
					console.log('请求获取验证码失败：' + res.msg);
					mui.toast('请求获取验证码失败：' + res.msg);
					//清除倒计时
					clearCount(interval, thisNode);
				} else {
					console.log('请求获取验证码成功：' + res.msg);
					mui.toast('请求获取验证码成功：' + res.msg);

					//注册短信监听事件
					registerSMS(handleSMS);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log('网络请求错误:' + type);
				//清除倒计时
				clearCount(interval, thisNode);

				if(type == 'timeout') {
					mui.toast('网络请求超时');
				} else {
					mui.toast('网络请求错误');
				}
			}
		});
	}

}

/*验证码登录*/
function submit_login02(e) {
	var thisNode = e.currentTarget;
	if(login.loginWIcode.phoneNumber == '' || login.loginWIcode.identiCode == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('输入框不能为空');
	} else {

		var timestamp1 = Date.parse(new Date()) + '';
		var pwd = timestamp1.substring(0, 9) + '_' + login.loginWIcode.identiCode;
		pwd = encrypt.encrypt(pwd);
		pwd = common.urlEncode(pwd);
		console.log('pwd:' + pwd);
		req = {
			id: register.registerWIcode.phoneNumber,
			identiCode: register.registerWIcode.identiCode,
			password: pwd,
			_: timestamp1.substring(0, 9),
			way: 'tel_verify_code'
		};

		//console.log("加密后：" + pwd);
		mui(thisNode).button('loading');
		mui.ajax(url + 'doLogin', {
			data: JSON.stringify(req),
			type: 'post', //HTTP请求类型
			timeout: 20000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log(data + '' + res.msg);
				if(res.suc < 0) {
					if(res.msg == "该用户已经登录") {
						console.log('该用户已经登录：' + JSON.stringify(res));
						mui.toast('该用户已经登录!');

						myStorage.setItem("launchFlag", "true");
						myStorage.setItem("isLogin", "true");

						setUserInfo(JSON.parse(myStorage.getItem("userInfo")));
						//跳转首页
						plus.navigator.setFullscreen(false);
						plus.navigator.setStatusBarBackground('#FFFFFF');
						plus.webview.currentWebview().close();
						mui(thisNode).button('reset');
					} else {
						mui.toast('验证码登录失败');
						console.log('验证码登录失败：' + JSON.stringify(res));
						mui(thisNode).button('reset');
					}
				} else {
					console.log('验证码登录成功：' + JSON.stringify(res));
					mui.toast('验证码登录成功!');

					myStorage.setItem("launchFlag", "true");
					myStorage.setItem("isLogin", "true");
					setUserInfo(res.data);
					//跳转首页
					plus.navigator.setFullscreen(false);
					plus.navigator.setStatusBarBackground('#FFFFFF');
					plus.webview.currentWebview().close();
					mui(thisNode).button('reset');
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；        02
				console.log('网络请求错误:' + type);
				mui(thisNode).button('reset');
				if(type == 'timeout') {
					mui.toast('网络请求超时');
				} else {
					mui.toast('网络请求错误');
				}
			}
		});
	}
}

//注册页面获取验证码
function getIdentCode_register(e) {

	//plus.nativeUI.showWaiting("等待中...", common.WaitingLoadingOptions);
	setTimeout(function() {
		plus.nativeUI.closeWaiting();
	}, 5000);

	var a = 60;
	var thisNode = e.currentTarget;
	console.log('register.registerWIcode.phoneNumber' + register.registerWIcode.phoneNumber);
	if(register.registerWIcode.phoneNumber == '') {
		mui.toast('手机号不能为空');
	} else {
		//保存数据到localStorage
		localStorage_addArrItem('registerWIcode_phoneNumber', register.registerWIcode.phoneNumber);

		//倒计时
		var interval = countDown(thisNode, a);

		mui.ajax(url + 'SMS', {
			data: {
				tel: register.registerWIcode.phoneNumber,
				action: 'get'
			},
			type: 'get',
			timeout: 20000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log('res:' + res.suc);

				if(res.suc < 0) {
					console.log('请求获取验证码失败：' + res.msg);
					mui.toast('请求获取验证码失败：' + res.msg);

					//清除倒计时
					clearCount(interval, thisNode);

				} else {
					console.log('请求获取验证码成功：' + res.msg);
					mui.toast('请求获取验证码成功：' + res.msg);

					//注册短信监听事件
					registerSMS(handleSMS);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);

				//清除倒计时
				clearCount(interval, thisNode);

				if(type == 'timeout') {
					mui.toast('网络请求超时');
				} else {
					mui.toast('网络请求错误');
				}
			}
		});

	}
}

function countDown(thisNode, a) {
	//倒计时
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
	return interval;
}

function clearCount(interval, thisNode) {
	//倒计时
	clearInterval(interval);
	thisNode.innerText = "获取验证码";
	thisNode.style.color = "#007aff";
	thisNode.classList.remove("mui-disabled");
}
/*注册*/
function go_register(e) {
	var thisNode = e.currentTarget;
	if(register.registerWIcode.phoneNumber == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('手机号不能为空');
	} else if(register.registerWIcode.password == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('密码不能为空');
	} else if(register.registerWIcode.identiCode == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('验证码不能为空');
	} else {

		console.log('注册信息' + ' ' + register.registerWIcode.phoneNumber + ' ' + register.registerWIcode.password + ' ' + register.registerWIcode.identiCode)
		var timestamp1 = Date.parse(new Date()) + '';
		var pwd = timestamp1.substring(0, 9) + '_' + register.registerWIcode.password;
		pwd = encrypt.encrypt(pwd);
		pwd = common.urlEncode(pwd);
		console.log('pwd:' + pwd);
		//console.log("加密后：" + pwd);
		mui(thisNode).button('loading');
		req = {
			phoneNumber: register.registerWIcode.phoneNumber,
			identiCode: register.registerWIcode.identiCode,
			password: pwd,
			_: timestamp1.substring(0, 9)
		};
		//console.log(typeof JSON.stringify(data))
		mui.ajax(url + 'doRegister', {
			data: JSON.stringify(req),
			asycn: false,
			type: 'post', //HTTP请求类型
			timeout: 20000,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log('res:' + res.suc);
				if(res.suc < 0) {
					console.log('注册失败：' + JSON.stringify(res));
					mui.toast('注册失败：' + JSON.stringify(res));

					setTimeout(function() {

						mui(thisNode).button('reset');
					}.bind(thisNode), 200);
				} else {
					console.log('注册成功：' + JSON.stringify(res));
					mui.toast('注册成功：' + JSON.stringify(res));

					viewApi.go('#login');
					mui(thisNode).button('reset');
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
				mui(thisNode).button('reset');
				if(type == 'timeout') {
					mui.toast('网络请求超时');
				} else {
					mui.toast('网络请求错误');
				}
			}
		});
	}
}

//显示隐藏其他登录方式
function login_show() {
	if(login.qqlogin_show) {
		login.qqlogin_show = false;
	} else {
		login.qqlogin_show = true;
	}
}

/*---------------------------------------------------------------*/
/*保存手机号记录到localStorage*/
mui('body').on('input', '.mui-input-clear', function() {
	//var thisNode = e.currentTarget;
	var thisNode = this;
	var div = thisNode.parentNode;
	var ul = div.nextElementSibling;
	ul.classList.remove('ul_input');
	ul.classList.add('ul_input_show');
	var id = thisNode.id;
	if(localStorage.getItem(id)) {
		var arr_input = JSON.parse(localStorage.getItem(id));
	} else {
		var arr_input = [];
	}
	var _value;
	switch(id) {
		case 'loginWPsw_phoneNumber':
			_value = login.loginWPsw.phoneNumber;
			break;
		case 'loginWIcode_phoneNumber':
			_value = login.loginWIcode.phoneNumber;
			break;
		case 'registerWIcode_phoneNumber':
			_value = register.registerWIcode.phoneNumber;
			break;
	}
	if(_value) {
		autoComplete(_value, arr_input, ul);
	} else {
		ul.innerHTML = '';
	}
})
mui('body').on('focusout', '.mui-input-clear', function() {
	var thisNode = this;
	var div = thisNode.parentNode;
	var ul = div.nextElementSibling;
	ul.innerHTML = '';
	ul.classList.remove('ul_input_show')
	ul.classList.add('ul_input');
})
mui('body').on('tap', '.li_input', function() {
	var thisNode = this;
	var par = thisNode.parentNode;
	var div = par.previousElementSibling;
	var input = div.childNodes[0];
	_value = thisNode.innerHTML;
	switch(input.id) {
		case 'loginWPsw_phoneNumber':
			login.loginWPsw.phoneNumber = _value;
			break;
		case 'loginWIcode_phoneNumber':
			login.loginWIcode.phoneNumber = _value;
			break;
		case 'registerWIcode_phoneNumber':
			register.registerWIcode.phoneNumber = _value;
			break;
	}
	par.innerHTML = '';
	par.classList.remove('ul_input_show')
	par.classList.add('ul_input');
})

function autoComplete(str, arr, ul) {
	var lis = [];
	arr.forEach(function(word) {
		if(word.startsWith(str)) {
			lis.push('<li class="mui-table-view-cell li_input">' + word + '</li>')
		}
	})
	ul.innerHTML = lis.join('')
}
///添加数组元素到localStorage
function localStorage_addArrItem(key_arr, input_str) {
	//保存数据到localStorage
	if(localStorage.getItem(key_arr)) {
		var arr_input = JSON.parse(localStorage.getItem(key_arr));
	} else {
		var arr_input = [];
	}
	//console.log(JSON.stringify(arr_input));
	var i = 0;
	arr_input.forEach(function(word) {
		if(word == input_str) {
			i++;
		}
	})
	if(i == 0) {
		arr_input.push(input_str);
		localStorage.setItem(key_arr, JSON.stringify(arr_input));
	}
}

//
var a = {
	"data": {
		"age": 0,
		"balance": 0,
		"birthday": "",
		"city": "",
		"credit": 0,
		"crttime": "2018-09-11 22:06:35.0",
		"description": "",
		"email": "",
		"imgUrl": "",
		"nickname": "",
		"openid": "",
		"regTel": "",
		"sex": "?",
		"signature": "",
		"tel": "",
		"uid": "10001"
	},
	"msg": "登陆成功!",
	"ret": 0,
	"suc": 0
}

//注册成功
var b = {
	"data": {
		"age": 0,
		"balance": 0,
		"birthday": "",
		"city": "",
		"credit": 0,
		"crttime": "2018-09-11 22:06:35",
		"description": "",
		"email": "",
		"imgUrl": ";",
		"nickname": "",
		"openid": "",
		"regTel": "13763369408",
		"sex": "男",
		"signature": "",
		"tel": "",
		"uid": "10001"
	},
	"msg": "注册成功!",
	"ret": 0,
	"suc": 0
}
var len = myStorage.getLength();
console.log(len)
//void myStorage.removeItem();
//void myStorage.clear();
//var foo = myStorage.key(index);
//var foo = myStorage.keyPlus(index);
//var item=myStorage.getItemByIndex(index);
//var item=myStorage.getItemByIndexPlus(index);
//var items=myStorage.getItems(key)
//void myStorage.removeItemBykeys(keys,cb)
for(var i = 0; i < len; i++) {
	var str = JSON.stringify(myStorage.getItemByIndex(i));
	console.log(str);
}
/* 
{"keyname":"age","keyvalue":"28"} at js/login02.js:750
 {"keyname":"arr"} at js/login02.js:750
 {"keyname":"city","keyvalue":"北京市 东城区"} at js/login02.js:750
 {"keyname":"desc","keyvalue":"这个人很懒，什么也没留下"} at js/login02.js:750
 {"keyname":"email","keyvalue":"1"} at js/login02.js:750
 {"keyname":"input_str"} at js/login02.js:750
 {"keyname":"isLogin","keyvalue":"false"} at js/login02.js:750
 {"keyname":"launchFlag","keyvalue":"false"} at js/login02.js:750
 {"keyname":"loginWIcode_phoneNumber"} at js/login02.js:750
 {"keyname":"loginWPsw_phoneNumber"} at js/login02.js:750
 {"keyname":"name","keyvalue":"萨瓦迪卡啦"} at js/login02.js:750
 {"keyname":"registerWIcode_phoneNumber"} at js/login02.js:750
 {"keyname":"sex","keyvalue":"男"} at js/login02.js:750
 {"keyname":"signature","keyvalue":"暂时没想到写点什么"} at js/login02.js:750
 */