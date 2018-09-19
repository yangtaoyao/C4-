mui.init({

});
mui('.mui-scroll-wrapper').scroll({
	//bounce: false,
	indicators: true, //是否显示滚动条
	//deceleration: deceleration
});
mui.plusReady(function() {
	//循环初始化所有下拉刷新，上拉加载。
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll-wrapper'), function(index, pullRefreshEl) {
		mui(pullRefreshEl).pullRefresh({
			down: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						self.endPulldownToRefresh();
					}, 500);
				}
			},
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						self.endPullupToRefresh();
					}, 500)
				}
			}
		});
	});
	webview_detail = mui.preload({
		url: 'assigment-detail.html',
		id: 'assigment-detail',
		styles: {
			"render": "always",
			"popGesture": "hide",
			"bounce": "vertical",
			"bounceBackground": "#efeff4",
		}
	});
})
var segmentedControl = document.getElementById('segmentedControl');

initData();

function initData() {
	//(search_vm.input_str).trim();
	mui.ajax(common.url + 'user?action=task&category=own', {
		data: '',
		asycn: true,
		type: 'get', //HTTP请求类型
		timeout: 20000,
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('失败：' + data);
				mui.toast('失败：' + data);

			} else {
				console.log('成功：' + data);
				//mui.toast('成功：' + data);
				var arr = res.data;
				arr.forEach(function(word) {
						if(word.expiretime != '')
							word.expiretime = new Date(parseInt(word.expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
						if(word.crttime != '')
							word.crttime = new Date(parseInt(word.crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
					console.log(JSON.stringify(word))
					switch(word.status) {
						case "0":
							assigment_vm.list0101.push(word);
							break;
						case "1":
							assigment_vm.list0102.push(word);
							break;
						case "2":
							assigment_vm.list0103.push(word);
							break;
						case "-1":
							assigment_vm.list0104.push(word);
							break;
					}
				})
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
	//2
	mui.ajax(common.url + 'user?action=task&category=others', {
		data: '',
		asycn: true,
		type: 'get', //HTTP请求类型
		timeout: 20000,
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			//console.log('res:' + data);
			if(res.suc < 0) {
				console.log('失败：' + data);
				mui.toast('失败：' + data);

			} else {
				console.log('成功：' + data);
				//mui.toast('成功：' + data);
				var arr = res.data;
				arr.forEach(function(word) {
					switch(word.status) {
						case "0":
							assigment_vm.list0201.push(word);
							break;
						case "1":
							assigment_vm.list0202.push(word);
							break;

					}
				})
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

var assigment_vm = new Vue({
	el: '#assigment',
	data: {
		list0101: [],
		list0102: [],
		list0103: [],
		list0104: [],
		list0201: [],
		list0202: []
	},
	// 计算属性
	computed: {
		//判断是否有数据
		isL1_01HasConent: function() {
			return(this.list0101 == undefined || this.list0101.length == 0) ? false : true;
		},
		isL1_02HasConent: function() {
			return(this.list0102 == undefined || this.list0102.length == 0) ? false : true;
		},
		isL1_03HasConent: function() {
			return(this.list0103 == undefined || this.list0103.length == 0) ? false : true;
		},
		isL1_04HasConent: function() {
			return(this.list0104 == undefined || this.list0104.length == 0) ? false : true;
		},
		isL2_01HasConent: function() {
			return(this.list0201 == undefined || this.list0201.length == 0) ? false : true;
		},
		isL2_02HasConent: function() {
			return(this.list0202 == undefined || this.list0202.length == 0) ? false : true;
		}
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

//
//var page2_item2 = document.getElementById('page2_item2');
//document.getElementById('page2_slider').addEventListener('slide', function(e) {
//	if(e.detail.slideNumber === 1) {
//		if(page2_item2.querySelector('.mui-loading')) {
//			setTimeout(function() {
//
//				page2_item2.querySelector('.mui-scroll').innerHTML = html2;
//			}, 500);
//		}
//	}
//});