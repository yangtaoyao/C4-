mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			height: 50, //可选,默认50.触发下拉刷新拖动距离,
			auto: true, //可选,默认false.首次加载自动下拉刷新一次
			contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: pulldownRefresh
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
var lastId = '',
	minId = ''; //最新新闻的id 
var webview_detail = null; //详情页webview
mui.plusReady(function() {
	var slider = mui("#slider");
	slider.slider({
		interval: 5000
	});
	webview_detail = mui.preload({
		url: 'index-subpage-home-detail.html',
		id: 'index-subpage-home-detail',
		styles: {
			"render": "always",
			"popGesture": "hide",
			"bounce": "vertical",
			"bounceBackground": "#efeff4",
		}
	});

	//添加列表项的点击事件
	//	mui('.mui-content').on('tap', '.home-card', function(e) {
	//		var id = this.getAttribute('id');
	//		//获得详情页面
	//		if(!detailPage) {
	//			detailPage = plus.webview.getWebviewById('index-subpage-home-detail.html');
	//		}
	//		//触发详情页面的newsId事件
	//		mui.fire(detailPage, 'newsId', {
	//			id: id
	//		});
	//		//打开详情页面          
	//	});

})

var home = new Vue({
	el: '#pullrefresh',
	data: {
		assortment: [{
				title: '推荐',
				desc: '10个任务正在进行中'
			},
			{
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
		],
		list01: {

		},
		list02: [],
		list03: [{
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
		},
		{
			"id": 67383,
			"from_id": "36kr",
			"title": "为了殖民火星，人类必须进行一场激进的基因改造",
			"published_at": "2018-08-19 15:16:04",

			"created_at": "2018-08-19 15:21:05",
			"updated_at": "2018-08-19 15:21:05"
		}, {
			"id": 67379,
			"from_id": "36kr",
			"title": "饥饿营销不灵，adidas要靠Yeezy收割业绩了吗？",
			"published_at": "2018-08-19 14:45:33",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:04",
			"updated_at": "2018-08-19 14:52:04"
		}, {
			"id": 67380,
			"from_id": "36kr",
			"title": "枭雄彭小峰：他结束了一个光伏时代",
			"published_at": "2018-08-19 14:41:22",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:04",
			"updated_at": "2018-08-19 14:52:04"
		}, {
			"id": 67381,
			"from_id": "36kr",
			"title": "知识产权纠纷不断，自动驾驶领域乱象几何？",
			"published_at": "2018-08-19 14:40:35",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:05",
			"updated_at": "2018-08-19 14:52:05"
		}, {
			"id": 67382,
			"from_id": "36kr",
			"title": "贸易战、金融战花样翻新，“美国优先”还是没能实现",
			"published_at": "2018-08-19 14:40:03",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:52:05",
			"updated_at": "2018-08-19 14:52:05"
		}, {
			"id": 67378,
			"from_id": "36kr",
			"title": "存在于聊天App中的“奢侈品商店”，Threads 获2000万美元融资",
			"published_at": "2018-08-19 14:35:30",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:41:05",
			"updated_at": "2018-08-19 14:41:05"
		}, {
			"id": 67376,
			"from_id": "36kr",
			"title": "如何走出舒适区？这里有10大窍门",
			"published_at": "2018-08-19 14:21:28",
			"store_at": "0000-00-00 00:00:00",
			"type": "news",
			"created_at": "2018-08-19 14:23:05",
			"updated_at": "2018-08-19 14:23:05"
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
		isL1HasConent: function() {
			return(this.list01 === null) ? false : true;
		},
		isL2HasConent: function() {
			return(this.list02 === undefined || this.list02.length == 0) ? false : true;
		},
		isL3HasConent: function() {
			return(this.list03 === undefined || this.list03.length == 0) ? false : true;
		}
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

function ranking_btn() {
	mui.openWindow({
		id: 'index-subpage-home-ranking',
		url: 'index-subpage-home-ranking.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: common.WaitingLoadingOptions
		}
	});
}

function assortment_btn() {

	mui.openWindow({
		id: 'index-subpage-home-assortment',
		url: 'index-subpage-home-assortment.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: {
				width: "100px",
				height: "100px",
				color: "#ffffff",
				background: "rgba(0,0,0,0.4)",
				loading: {
					display: "block",
					height: "30px",
					icon: "images/logo.png"
				}
			}
		}
	});
}

function searching_btn() {

	mui.openWindow({
		id: 'index-subpage-home-searching',
		url: 'index-subpage-home-searching.html',
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '加载中...', //等待对话框上显示的提示内容
			options: {
				width: "100px",
				height: "100px",
				color: "#ffffff",
				background: "rgba(0,0,0,0.4)",
				loading: {
					display: "block",
					height: "30px",
					icon: "images/logo.png"
				}
			}
		}
	});
}
//

var count = 0;

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

		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
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