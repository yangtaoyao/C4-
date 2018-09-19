mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			height: 50, //可选,默认50.触发下拉刷新拖动距离,
			auto: false, //可选,默认false.首次加载自动下拉刷新一次
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
		list02: [
			//		{
			//			"content": "my",
			//			"countAccess": 0,
			//			"credit": 10,
			//			"crttime": "1536821606",
			//			"expiretime": "1546821606",
			//			"finisher": "",
			//			"imgurl": "my",
			//			"label": "my",
			//			"price": 10.100000381469727,
			//			"status": "0",
			//			"tid": "10012",
			//			"uid": "10000"
			//		}
		],
		list03: [],
		lastest_crttime: '',
		start: 0,
		size: 2
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
		isL2HasConent: function() {
			return(this.list02 === undefined || this.list02.length == 0) ? false : true;
		},
		isL3HasConent: function() {
			return(this.list03 === undefined || this.list03.length == 0) ? false : true;
		}
	}
});

//task ? action = page & start = * & size = *
//latest ? crttime =

//上拉刷新
function pullupRefresh() {
	console.log('上拉');
	mui.ajax(common.url + "task?action=page&start=" + home.start + "&size=" + home.size, {
		//data: req,
		async: true,
		type: 'get', //HTTP请求类型
		timeout: 20000,
		//contentType: 'charset=UTF-8',
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('上拉失败：' + data);
				mui.toast('上拉失败：' + data);
			} else {
				console.log('上拉成功：' + data);
				//mui.toast('搜索成功：' + data);
				//				if(res.data == null || res.data.length < home.size) {
				//					mui.toast('没有任何新任务');
				//				} else {
				var arr = res.data;
				if(arr != undefined & arr != null&arr.length!=0) {
					if(home.start==0){
						home.lastest_crttime = arr[0].crttime;
					}
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].expiretime != '')
							arr[i].expiretime = new Date(parseInt(arr[i].expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						//console.log(arr.expiretime)
						if(arr[i].crttime != '')
							arr[i].crttime = new Date(parseInt(arr[i].crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						//console.log(arr.expiretime)
					}
					home.list03 = home.list03.concat(arr);
					home.start = home.start + home.size;
					
					console.log('lastest_crttime' + home.lastest_crttime)
				}else{
					mui.toast('没有更多任务')
				}

				//}
			}
		},
		error: function(xhr, type, errorThrown) {
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
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
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	if(home.lastest_crttime == '') {
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		return;
	}
	var url = common.url + "task?action=latest&crttime=" + home.lastest_crttime;
	mui.ajax(url, {
		type: 'get', //HTTP请求类型
		timeout: 20000,
		//contentType: 'charset=UTF-8',
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('搜索失败：' + data);
				mui.toast('搜索失败：' + data);
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			} else {
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				console.log('下拉成功：' + data);
				//mui.toast('搜索成功：' + data);
				var arr=res.data;
				if(arr != undefined & arr != null&arr.length!=0) {
					if(home.start!=0){
						home.lastest_crttime = arr[0].crttime;	
					}
					
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].expiretime != '')
							arr[i].expiretime = new Date(parseInt(arr[i].expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						//console.log(arr.expiretime)
						if(arr[i].crttime != '')
							arr[i].crttime = new Date(parseInt(arr[i].crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						//console.log(arr.expiretime)
					}
					home.list03 = arr.concat(home.list03);
					home.start = home.start + home.size;
					
					console.log('lastest_crttime' + home.lastest_crttime);
					UIAlertViewShow();
				}else{
					mui.toast('没有新任务');
				}
//				
//				if(res.data == undefined || res.data.length == 0) {
//					
//				} else {
//
//					
//					home.list03 = res.data.concat(home.list03);
//					home.lastest_crttime = home.list03[0].crttime;
//					console.log("home.lastest_crttime" + home.lastest_crttime)
//					for(var i = 0; i < home.list03.length; i++) {
//						if(home.list03[i].expiretime != '')
//							home.list03[i].expiretime = new Date(parseInt(home.list03[i].expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
//						console.log(home.list03[i].expiretime)
//						if(home.list03[i].crttime != '')
//							home.list03[i].crttime = new Date(parseInt(home.list03[i].crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
//					}
//
//				}
			}
		},
		error: function(xhr, type, errorThrown) {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
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

function UIAlertViewShow() {
	$('.UIAlertView').fadeIn(500);
	setTimeout(function() {
		$('.UIAlertView').slideUp(500);
	}, 3000);
}