var vm = new Vue({
	el: '#webview_detail',
	data: getDefaultData(),
	methods: {
		resetData: function() { //重置数据
			Object.assign(this.$data, getDefaultData());
		}
	},
	computed: {
		labelicon: function() {
			if(this.label == '学习') {
				return "images/xuexiicon.png"
			} else if(this.label == '解题') {
				return "images/jietiicon.png"
			} else if(this.label == '生活') {
				return "images/kuaidiicon.png"
			}
		}
	}
});

function receive_task() {
	var btnArray = ['是', '否'];
	mui.confirm('确定接受该任务？', '接受该任务', btnArray, function(e) {
		if(e.index == 0) {
			var wt = plus.nativeUI.showWaiting();
			mui.ajax(common.url + 'task?action=receive&tid=' + vm.tid, {
				type: 'GET',
				dataType: 'json', //服务器返回json格式数据
				timeout: 15000, //15秒超时
				success: function(rsp) {
					//vm.content = rsp.content;
					console.log('接受任务res:' + JSON.stringify(rsp));
					if(rsp.suc < 0) {
						wt.close();
						mui.toast('接受失败');
					} else {
						wt.close();
						mui.toast('接受成功');
					}
				},
				error: function(xhr, type, errorThrown) {
					wt.close();
					mui.toast('连接服务器失败');
					//TODO 此处可以向服务端告警
				}
			});
		} else {
			mui.toast('已取消');
		}
	})
}

function getDefaultData() {
	return {
		expiretime: '',
		crttime: '',
		finisher: '',
		label: '',
		content: '',
		price: '',
		status: '',
		tid: '',
		uid: '',
		countAccess: '',
		credit: '',
		imgurl: ''
	}
}
//监听自定义事件，获取新闻详情
document.addEventListener('get_detail', function(event) {
	var tid = event.detail.tid;
	if(!tid) {
		return;
	}

	//前页传入的数据，直接渲染，无需等待ajax请求详情后
	vm.expiretime = event.detail.expiretime;
	vm.crttime = event.detail.crttime;
	vm.finisher = event.detail.finisher;
	vm.label = event.detail.label;
	vm.content = event.detail.content;
	vm.price = event.detail.price;
	vm.status = event.detail.status;
	vm.tid = event.detail.tid;
	vm.uid = event.detail.uid;
	vm.countAccess = event.detail.countAccess;
	vm.credit = event.detail.credit;
	//vm.imgurl= event.detail.imgurl;
	vm.imgurl = "http://59.110.241.117:12001/jieyou/resource/img/user/" + vm.uid + "/" + vm.imgurl;
	console.log("vm.imgurl" + vm.imgurl)
	//向服务端请求文章详情内容

	mui.ajax(common.url + 'user?action=getInfo&uid=' + vm.uid, {
		type: 'GET',
		dataType: 'json', //服务器返回json格式数据
		timeout: 15000, //15秒超时
		success: function(rsp) {
			//vm.content = rsp.content;
			console.log('获取用户信息res:' + JSON.stringify(rsp));
		},
		error: function(xhr, type, errorThrown) {
			mui.toast('获取信息失败');
			//TODO 此处可以向服务端告警
		}
	});
});

//重写返回逻辑
mui.back = function() {
	plus.webview.currentWebview().hide("auto", 300);
}

//窗口隐藏时，重置页面数据
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	self.addEventListener("hide", function(e) {
		window.scrollTo(0, 0);
		vm.resetData();
	}, false);
})