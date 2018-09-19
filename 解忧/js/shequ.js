//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	//bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
var webview_detail = null;
mui.plusReady(function() {
	//循环初始化所有下拉刷新，上拉加载。
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll-wrapper'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullRefresh({
			down: {
				callback: function() {
					var self = this;
					setTimeout(function() {

						self.endPulldownToRefresh();
					}, 2000);
				}
			},
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						reflesh();
						self.endPullupToRefresh();
					}, 2000)
				}
			}
		});
		webview_detail = mui.preload({
			url: 'index-subpage-shequ-detail01.html',
			id: 'index-subpage-shequ-detail01',
			styles: {
				"render": "always",
				"popGesture": "hide",
				"bounce": "vertical",
				"bounceBackground": "#efeff4",
			}
		});
	});
	reflesh();

});

function open_detail(item) {
	//触发子窗口变更新闻详情
	mui.fire(webview_detail, 'get_detail', {
		content: item.content,
		crttime: item.crttime,
		floor: item.floor,
		fmid: item.fmid,
		imgurl: item.imgurl,
		love: item.love,
		mid: item.mid,
		uid:item.uid
	});
	setTimeout(function() {
		webview_detail.show("slide-in-right", 300);
	}, 150);
}

var shequ = new Vue({
	el: '#slider',
	data: {
		banner: {}, //顶部banner数据
		items01: [],
		items02: [],
		items03: [],
		start: 0,
		size: 5
	},
	computed: {
		isL1HasConent: function() {
			return(this.items01 === undefined || this.items01.length == 0) ? false : true;
		},
		isL2HasConent: function() {
			return(this.items02 === undefined || this.items02.length == 0) ? false : true;
		},
		isL3HasConent: function() {
			return(this.items03 === undefined || this.items03.length == 0) ? false : true;
		}
	}
})

function reflesh() {
	mui.ajax(common.url + "msg?action=page&start=" + shequ.start + "&size=" + shequ.size, {
		//data: req,
		async: true,
		type: 'get', //HTTP请求类型
		timeout: 20000,
		//contentType: 'charset=UTF-8',
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			//mui('#pullrefresh').pullRefresh().endPullupToRefresh();
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('上拉失败：' + data);
				mui.toast('上拉失败：' + data);
			} else {
				console.log('上拉成功：' + data);
				//mui.toast('搜索成功：' + data);
				shequ.start = shequ.start + shequ.size;
				shequ.items01 = shequ.items01.concat(res.data);

			}
		},
		error: function(xhr, type, errorThrown) {
			//mui('#pullrefresh').pullRefresh().endPullupToRefresh();
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