mui.plusReady(function() {
	//预加载添加页面
	webview_middleBtnPage = mui.preload({
		url: 'middleBtnPage.html',
		id: 'middleBtnPage'
	});
	
	var self = plus.webview.currentWebview();
	var home = plus.webview.getSecondWebview();
	self.append(home);

	/**
	 * 获取本地存储中launchFlag的值
	 * http://www.html5plus.org/doc/zh_cn/storage.html#plus.storage.getItem
	 * 若存在，说明不是首次启动，直接进入首页；
	 * 若不存在，说明是首次启动，进入引导页；
	 */
	var showGuide = myStorage.getItem("launchFlag");
	//仅支持竖屏显示
	plus.screen.lockOrientation("portrait-primary");
	if(showGuide == "true") {
		//有值，说明已经显示过了，无需显示；
		//关闭splash页面；
		plus.navigator.closeSplashscreen();
		plus.navigator.setFullscreen(false);
		//预加载
		//preload();
		
	} else {
		//显示启动导航
		mui.openWindow({
			id: 'login02',
			url: 'login02.html',
			extras: {
				activeP: 'guide' //扩展参数
			},
			styles: {
				popGesture: "none"
			},
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
		//webview_login.show("fade-in", 420);
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//预加载
			//preload();
		}, 200);
	}

	var subpages = ['index-subpage-home.html', 'index-subpage-shequ.html', 'index-subpage-xiaoxi.html', 'index-subpage-wode.html'];
	var subpage_style = {
		top: '0px',
		bottom: '51px'
	};

	var aniShow = {};

	//创建子页面，首个选项卡页面显示，其它均隐藏；
	//					var self = plus.webview.currentWebview();
	//					var home = plus.webview.getSecondWebview();
	//					self.append(home);

	for(var i = 1; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}

	//当前激活选项
	var activeTab = subpages[0];
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		//打开添加页面
		if(this.getAttribute('id') == 'goto_add') {
			/*重新加载页面*/
			//						var wobj = plus.webview.getWebviewById("middleBtnPage");
			//						if(wobj) {
			//							wobj.reload(true);
			//						}

			//触发子窗口变更middleBtnPage页面更新数据
			var time = getCurTime();

			/*自定义事件*/
			mui.fire(webview_middleBtnPage, 'get_time', {
				mydate: time.mydate,
				mymonth: time.mymonth,
				myday: time.myday,
				myyear: time.myyear,
				myhour: time.myhour,
				myminute: time.myminute,
			});
			//打开添加页面          
			webview_middleBtnPage.show("fade-in", 420);

			return;
		}

		//打开非添加页面
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		}
		//更换标题
		//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

	//获取当前时间并转换为json
	function getCurTime() {
		var myDate = new Date();
		time = {
			mydate: '',
			mymonth: '',
			myday: '',
			myyear: '',
			myhour: '',
			myminute: '',
		};
		time.mydate = myDate.getDate() + "日";
		switch(myDate.getDay()) {
			case 0:
				time.myday = "星期日";
				break;
			case 1:
				time.myday = "星期一";
				break;
			case 2:
				time.myday = "星期二";
				break;
			case 3:
				time.myday = "星期三";
				break;
			case 4:
				time.myday = "星期四";
				break;
			case 5:
				time.myday = "星期五";
				break;
			case 6:
				time.myday = "星期六";
				break;
		}
		time.myyear = myDate.getFullYear() + "年";
		time.mymonth = myDate.getMonth() + 1 + "月";
		if(myDate.getHours() < 10) {
			time.myhour = "0" + myDate.getHours() + ":";
		} else {
			time.myhour = myDate.getHours() + ":";
		}
		if(myDate.getMinutes() < 10) {
			time.myminute = "0" + myDate.getMinutes();
		} else {
			time.myminute = myDate.getMinutes();
		}
		return time;
	}

	//自定义事件，模拟点击“首页选项卡”
	document.addEventListener('gohome', function() {
		var defaultTab = document.getElementById("defaultTab");
		//模拟首页点击
		mui.trigger(defaultTab, 'tap');
		//切换选项卡高亮
		var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
		if(defaultTab !== current) {
			current.classList.remove('mui-active');
			defaultTab.classList.add('mui-active');
		}
	});

});

/**
 * 重写mui.back()，一秒内连续点击两次，退出应用，仅安卓有效；
 */
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