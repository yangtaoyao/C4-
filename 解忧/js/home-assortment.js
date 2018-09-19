var main, menu, mask = mui.createMask(_closeMenu);
var showMenu = false,
	mode = 'menu-move';

function back() {
	if(showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
		closeMenu();
		return false;
	} else {
		//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
		menu.close('none');
		return true;
	}
}
mui.init({
	swipeBack: false,
	beforeback: back,
	pullRefresh: {
		container: '#pullRefresh',
		down: {
			style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: '50px', //可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
			auto: true, //可选,默认false.首次加载自动上拉刷新一次
			callback: pulldownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		
	},
});
//mui('#pullRefresh').pullRefresh().disablePullupToRefresh();
var webview_detail = null;
mui.plusReady(function() {
	//预加载详情页
	webview_detail = mui.preload({
		url: 'index-subpage-home-detail.html',
		id: 'index-subpage-home-detail',

	});

	main = plus.webview.currentWebview();
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		menu = mui.preload({
			id: 'home-assortment-drag-left-menu',
			url: 'home-assortment-drag-left-menu.html',
			styles: {
				left: "30%",
				width: '70%',
				zindex: 9997
			}
		});
	}, 300);

	webview_detail = plus.webview.getWebviewById('index-subpage-home-detail');

})
//
var assortment_list = new Vue({
	el: '#assortment_list',
	data: {
		assortment_datalist: [{
				title: '学习资料分享',
				desc: '12个任务正在进行中'
			},
			{
				title: '学霸来支招',
				desc: '8个任务正在进行中'
			},
			{
				title: '校园竞赛组队',
				desc: '1个任务正在进行中'
			},
			{
				title: '生活互助服务',
				desc: '8个任务正在进行中'
			},
			{
				title: '解题',
				desc: '8个任务正在进行中'
			}
		]
	}
});
//
var assortment = new Vue({
	el: '#pullRefresh',
	data: {
		list: [
			//		{
			//			"id": 67383,
			//			"from_id": "36kr",
			//			"title": "C语言指针溢出问题",
			//			"published_at": "2018-08-19 15:16:04",
			//
			//			"created_at": "2018-08-19 15:21:05",
			//			"updated_at": "2018-08-19 15:21:05"
			//		}, {
			//			"id": 67379,
			//			"from_id": "36kr",
			//			"title": "解个高数问题",
			//			"published_at": "2018-08-19 14:45:33",
			//			"store_at": "0000-00-00 00:00:00",
			//			"type": "news",
			//			"created_at": "2018-08-19 14:52:04",
			//			"updated_at": "2018-08-19 14:52:04"
			//		}, {
			//			"id": 67380,
			//			"from_id": "36kr",
			//			"title": "请教一下学长如何为考研准备",
			//			"published_at": "2018-08-19 14:41:22",
			//			"store_at": "0000-00-00 00:00:00",
			//			"type": "news",
			//			"created_at": "2018-08-19 14:52:04",
			//			"updated_at": "2018-08-19 14:52:04"
			//		}
		]
	},
	// 计算属性
	computed: {
		//判断是否有数据
		isListHasConent: function() {
			return(this.list == null || this.list.length == 0) ? false : true;
		},

	}
});

function open_detail(item) {
	//触发子窗口变更新闻详情
	mui.fire(webview_detail, 'get_detail', {
		expiretime: item.expiretime,
		crttime: item.crttime,
		finisher: item.finisher,
		label: item.label,
		content: item.content,
		price: item.price,
		status: item.status,
		tid: item.tid,
		uid: item.uid,
		countAccess: item.countAccess,
		credit: item.credit,
		imgurl: item.imgurl,
	});
	setTimeout(function() {
		webview_detail.show("slide-in-right", 300);
	}, 150);
}
//上拉刷新
function pullupRefresh() {
	setTimeout(function() {
		search("全部");
	}, 1500);
}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		search("全部");
		mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
		//UIAlertViewShow();
	}, 1500);
}

function search(str) {
	if(str == "全部") {
		str = ""
	}
	var url = common.url + "task?action=search&key=" + encodeURI(str);
	console.log(url)
	mui.ajax(url, {
		async: true,
		type: 'get', //HTTP请求类型
		timeout: 20000,
		//contentType: 'charset=UTF-8',
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('加载失败：' + data);
				mui.toast('加载失败：' + data);

			} else {
				if(res.data == undefined || res.data.length == 0) {
					mui.toast('暂时还没有该类任务');
					assortment.list = []
				} else {
					console.log('加载成功：' + data);
					mui.toast('加载成功');
					setTimeout(function() {
						UIAlertViewShow();
					}, 3000)
					assortment.list = res.data;
					for(var i = 0; i < assortment.list.length; i++) {
						if(assortment.list[i].expiretime != '')
							assortment.list[i].expiretime = new Date(parseInt(assortment.list[i].expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						if(assortment.list[i].crttime != '')
							assortment.list[i].crttime = new Date(parseInt(assortment.list[i].crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
					}

					console.log(assortment.isListHasConent)
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			console.log(type);
			if(type == 'timeout') {
				mui.toast('网络请求超时');
			} else {
				mui.toast('网络请求错误');
			}
		}
	});

}

document.addEventListener('get_search', function(event) {
	var str = event.detail.str;
	search(str)
});
/*----------------------------*/
/*
 * 显示菜单菜单
 */
function openMenu() {
	if(!showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}

		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		menu.show('none', 0, function() {

			menu.setStyle({
				left: '30%',
				transition: {
					duration: 150
				}
			});

		});
		//显示主窗体遮罩
		mask.show();
		showMenu = true;
	}
}

function closeMenu() {
	//窗体移动
	_closeMenu();
	//关闭遮罩
	mask.close();
}

/**
 * 关闭侧滑菜单(业务部分)
 */
function _closeMenu() {
	if(showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if(mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}

		//主窗体开始侧滑；
		menu.setStyle({
			left: '100%',
			transition: {
				duration: 150
			}
		});

		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 300);
		showMenu = false;
	}
}

//menu页面向右滑动，关闭菜单；
window.addEventListener("menu:swiperight", closeMenu);
/*----------------------------*/

function UIAlertViewShow() {
	$('.UIAlertView').fadeIn(500);
	setTimeout(function() {
		$('.UIAlertView').slideUp(500);
	}, 3000);
}