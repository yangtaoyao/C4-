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
		up: {
			height: 50, //可选.默认50.触发上拉加载拖动距离
			auto: true, //可选,默认false.自动上拉加载一次
			contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: pullupRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	},
});
var webview_detail = null;
mui.plusReady(function() {
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
				title: '生活互助服务',
				desc: '8个任务正在进行中'
			}
		]
	}
});
var assortment = new Vue({
	el: '#pullRefresh',
	data: {
		list: [{
			"id": 67383,
			"from_id": "36kr",
			"title": "C语言指针溢出问题",
			"published_at": "2018-08-19 15:16:04",

			"created_at": "2018-08-19 15:21:05",
			"updated_at": "2018-08-19 15:21:05"
		}, {
			"id": 67379,
			"from_id": "36kr",
			"title": "解个高数问题",
			"published_at": "2018-08-19 14:45:33",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:04",
			"updated_at": "2018-08-19 14:52:04"
		}, {
			"id": 67380,
			"from_id": "36kr",
			"title": "请教一下学长如何为考研准备",
			"published_at": "2018-08-19 14:41:22",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:04",
			"updated_at": "2018-08-19 14:52:04"
		}]
	},
	// 计算属性
	computed: {
		fullName: {
			// getter
			get: function() {

			},
			// setter
			set: function(newValue) {

			}
		},
		//判断是否有数据
		isListHasConent: function() {
			return(this.list === null) ? false : true;
		},

	}
});

function open_detail(item) {
	//触发子窗口变更新闻详情
	mui.fire(webview_detail, 'get_detail', {
		guid: item.guid,
		title: item.title,
		author: item.author,
		time: item.time,
		cover: item.cover
	});
	setTimeout(function() {
		webview_detail.show("slide-in-right", 300);
	}, 150);
}
//上拉刷新
function pullupRefresh() {
	setTimeout(function() {
		//		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 10)); //参数为true代表没有更多数据了。
		//		var table = document.body.querySelector('.list02');
		//		var cells = document.body.querySelectorAll('.home-table-view-cell');
		//		var newCount = cells.length > 0 ? 5 : 20; //首次加载20条，满屏
		//for(var i = cells.length, len = i + newCount; i < len; i++) {
		//			var li = document.createElement('li');
		//			li.className = 'home-table-view-cell';
		//			li.innerHTML =
		//				'<a href="#" class="home-card ">' +
		//				'<div class="home-card-left ">' +
		//				'<span>最急</span>' +
		//				'<img src="images/kuaidiicon.png" />' +
		//				'<p>学习</p>' +
		//				'</div>' +
		//				'<div class="home-card-right ">' +
		//				'<h5>帮帮单' + Math.ceil(10 * Math.random()) + '</h5>' +
		//				'<p class="deadline"><span>截止 </span><span >' + new Date() + '</span></p>' +
		//				'<p ><span class="reward">¥8.00</span><span class="participants">' + Math.ceil(10 * Math.random()) + '人</span></p>' +
		//				'</div>' +
		//				'</a>';
		//
		//			var a = li.getElementsByTagName('a')[0];
		//			var span = (a.children[0]).getElementsByTagName('span')[0];
		//			var img = (a.children[0]).getElementsByTagName('img')[0];
		//			var p = (a.children[0]).getElementsByTagName('p')[0];
		//			//更新数据
		//			a.src = 'index-subpage-wode.html';
		//			span = '最新';
		//			var imgs = ['images/xuexi.png', 'images/xuexiicon.png', 'images/xunwuicon.png', 'images/kuaidiicon.png', 'images/jietiicon.png']
		//			img.src = imgs[parseInt(Math.random() * 5)];
		//
		//			table.appendChild(li);
		//}
		var datalist = assortment.list;
		datalist.forEach(function(item) {
			assortment.list.push(item);
		})

	}, 1500);
}

function addData() {
	//	var table = document.body.querySelector('.mui-table-view');
	//	var cells = document.body.querySelectorAll('.home-table-view-cell');
	//	for(var i = cells.length, len = i + 5; i < len; i++) {
	//		var li = document.createElement('li');
	//		li.className = 'home-table-view-cell';
	//		li.innerHTML = '<a href="# " class="home-card ">' +
	//			'<div class="home-card-left ">' +
	//			'<span>热门</span>' +
	//			'<img src="images/xuexi.png " />' +
	//			'<p>学习</p>' +
	//			'</div>' +
	//			'<div class="home-card-right ">' +
	//			'<span>日新楼帮忙去快递</span>' +
	//			'<p><span>截止时间:</span><span>' + +'</span></p>' +
	//			'<p><span>赏金:</span><span>' + +'</span></p>' +
	//			'<p><span>正在竞标：</span><span>' + +'人</span></p>' +
	//			'</div>' +
	//			'</a>';
	//		//	
	//		var a = li.getElementsByTagName('a')[0];
	//		var span = (a.children[0]).getElementsByTagName('span')[0];
	//		var img = (a.children[0]).getElementsByTagName('img')[0];
	//		var p = (a.children[0]).getElementsByTagName('p')[0];
	//		//更新数据
	//		a.src = 'index-subpage-wode.html';
	//		span = '最新';
	//		var imgs = ['images/xuexi.png', 'images/xuexiicon.png', 'images/xunwuicon.png', 'images/kuaidiicon.png', 'images/jietiicon.png']
	//		img.src = imgs[parseInt(Math.random() * 5)];
	//
	//		//下拉刷新，新纪录插到最前面；
	//		table.insertBefore(li, table.firstChild);
	//	}

}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		addData();

		mui('#pullRefresh').pullRefresh().endPulldownToRefresh();
		UIAlertViewShow();
		mui.toast("为你更新了5个最新任务 ");

	}, 1500);
}

function UIAlertViewShow() {
	$('.UIAlertView').fadeIn(500);
	setTimeout(function() {
		$('.UIAlertView').slideUp(500);
	}, 3000);
}