mui.init();
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#purse'
});
//服务器ip
var url = common.url;
//加密
var encrypt = new JSEncrypt();
encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6JbMo802QOZHkyLBc590xa9lHjBwxAU7jbDuUfUUYwxlkLdjPhxfoh+hC2HNeHuD6t975UwBpU9QQ5ewepz/+DiOkVy8fh10NtND6LijYRcKlHT4FoVhPIZV7amX2DAcRssGqRUYK2/ufE6LL3dzz/a8Qw9/i0y4LhdxrZecZ176X+6OOQnRQzKNb2c66aKXSZL7dehZuFFqd/To85r4QJt2la7xarCL3lP1/3Ax3wDwxhKPFTIpuDU1R6r7SfE7By6m1n27ikuFbWQigPr3Gx7xDPy+huTYZh+HlcGgG9dcxMwzzN1Q8fKKfecMZNcyBl4urrF+3k0SI28i3nZr0QIDAQAB');


//初始化单页的区域滚动
//mui('.mui-scroll-wrapper').scroll();
mui.plusReady(function() {

	/*
	 * 处理view的后退与webview后退与推出应用
	 */
	var first = null;
	var currentWebview = plus.webview.currentWebview();
	//var opener = currentWebview.opener();
	var webViewBack = function() {
		//plus.navigator.setFullscreen(false);
		plus.webview.close(currentWebview, "slide-out-right", 200);
	};
	mui.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			webViewBack();
		}
	};
})

var purse = new Vue({
	el: '#purse',
	data: {
		purse_sum: '' //余额
	},
});

var setPwd = new Vue({
	el: '#setPwd',
	data: {
		arr_pwd: [],

		payPwd: '' //支付密码

	},
	computed: {
		input_pwd: function() {
			return this.arr_pwd.join('');
		}
	}
});

function setPwd_btn(e) {
	var thisNode = e.currentTarget;
	if(setPwd.input_pwd == '') {
		mui(thisNode).button('loading');
		setTimeout(function() {
			mui(thisNode).button('reset');
		}.bind(thisNode), 200);
		mui.toast('密码不能为空');
	} else {
		mui(thisNode).button('loading');
		///jieyou/user ? action = setPay & pay_token = 加密后的支付密码 & _ = 时间戳
		var timestamp1 = Date.parse(new Date()) + '';
		var pwd = timestamp1.substring(0, 9) + '_' + setPwd.input_pwd;
		pwd = encrypt.encrypt(pwd);
		//pwd = common.urlEncode(pwd);
		req = {
			action: 'setPay',
			pay_token: pwd,
			_ : timestamp1.substring(0, 9)
		};
		console.log(JSON.stringify(req))
		mui.ajax(common.url + 'user', {
			data: req,
			type: 'get', //HTTP请求类型
			timeout: 20000,
			asycn:false,
			//processData: false,
			success: function(data) {
				//获得服务器响应
				res = JSON.parse(data);
				console.log( 'res:' + res.msg);
				if(res.suc < 0) {
					mui.toast('设置支付密码失败：' + JSON.stringify(res));
					console.log('设置支付密码失败：' + JSON.stringify(res));
					mui(thisNode).button('reset');
				} else {
					console.log('设置支付密码成功：' + JSON.stringify(res));
					mui.toast('设置支付密码成功!');
					viewApi.back();
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
mui('body').on('tap', '.pay_key .mui-table-view-cell a', function() {
	var thisNode = this;
	var children = thisNode.children[0];
	if(children.tagName == "DIV") {
		setPwd.arr_pwd.push(children.innerText);

	} else {
		if(setPwd.arr_pwd != undefined || setPwd.arr_pwd.length != 0) {
			setPwd.arr_pwd.pop();
		}

	}

	console.log('更改后' + setPwd.input_pwd);
})