var url = common.url;
var webview_detail = ';'
mui.plusReady(function() {
	//预加载详情页
	webview_detail = mui.preload({
		url: 'index-subpage-home-detail.html',
		id: 'index-subpage-home-detail',

	});
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
		countAccess:item.countAccess,
		credit: item.credit,
		imgurl:item.imgurl,
	});
	setTimeout(function() {
		webview_detail.show("slide-in-right", 300);
	}, 150);
}

function search_submit() {
//	if(search_vm.input_str == '') {
//		return;
//	}
	localStorage_addItem("input_str", search_vm.input_str);
	//url编码
	var url = common.url+"task?action=search&key=" + encodeURI(search_vm.input_str.trim());
	console.log(url)
	mui.ajax(url, {
		//data: req,
		async: false,
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

			} else {
				console.log('搜索成功：' + data);
				//mui.toast('搜索成功：' + data);
				search_vm.list = res.data;
				for(var i = 0; i < search_vm.list.length; i++) {
					if(search_vm.list[i].expiretime != '')
						search_vm.list[i].expiretime = new Date(parseInt(search_vm.list[i].expiretime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
					if(search_vm.list[i].crttime != '')
						search_vm.list[i].crttime = new Date(parseInt(search_vm.list[i].crttime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
				}
				if(search_vm.list == undefined || search_vm.list.length == 0) {
					mui.toast('没有搜到任何任务')
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

var search_vm = new Vue({
	el: '#search_app',
	data: {
		input_str: '',
		list: [
			//		{
			//				"content": "my",
			//				"countAccess": 0,
			//				"credit": 10,
			//				"crttime": "1536821606",
			//				"expiretime": "1546821606",
			//				"finisher": "",
			//				"imgurl": "my",
			//				"label": "my",
			//				"price": 10.100000381469727,
			//				"status": "0",
			//				"tid": "10012",
			//				"uid": "10000"
			//			}
			//					{
			//						"id": 67383,
			//						"from_id": "36kr",
			//						"title": "C语言指针溢出问题",
			//						"published_at": "2018-08-19 15:16:04",
			//
			//						"created_at": "2018-08-19 15:21:05",
			//						"updated_at": "2018-08-19 15:21:05"
			//					}
		],
		time: ''
	},
	// 计算属性
	computed: {

		//判断是否有数据
		isListHasConent: function() {
			return(this.list == undefined || this.list.length == 0) ? false : true;

		},
		isInput_str: function() {
			return(this.input_str == '') ? false : true;
		}
	}
});

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
console.log(getLocalTime(1546821606));