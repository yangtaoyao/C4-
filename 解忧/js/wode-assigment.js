mui.init({

});
mui('.mui-scroll-wrapper').scroll({
	indicators: true //是否显示滚动条
});
var segmentedControl = document.getElementById('segmentedControl');
initData();

function initData() {
	var resData01;
	var resData02;
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
				resData01 = res.data;
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
				resData02 = res.data;
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
	if((resData01 == undefined || resData01.length == 0)&&(resData02 == undefined || resData02.length == 0)) {
		mui.toast('暂时没有任务');
	}
} 

var assigment_vm = new Vue({
	el: '#assigment',
	data: {
		list0101: [],
		list0102: [],
		list0103: [],
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
		isL2_01HasConent: function() {
			return(this.list0201 == undefined || this.list0201.length == 0) ? false : true;
		},
		isL2_02HasConent: function() {
			return(this.list0202 == undefined || this.list0202.length == 0) ? false : true;
		}
	}
});


//var a={
//	expiretime: item.expiretime,
//	crttime: item.crttime,
//	finisher: item.finisher,
//	label: item.label,
//	content: item.content,
//	price: item.price,
//	status: item.status,
//	tid: item.tid,
//	uid: item.uid,
//	countAccess: item.countAccess,
//	credit: item.credit,
//	imgurl: item.imgurl,
//}
//var page1_item2 = document.getElementById('page1_item2');
//var page1_item3 = document.getElementById('page1_item3');
//document.getElementById('page1_slider').addEventListener('slide', function(e) {
//	if(e.detail.slideNumber === 1) {
//		if(page1_item2.querySelector('.mui-loading')) {
//			setTimeout(function() {
//				console.log(assigment_vm.isL1_01HasConent)
//				page1_item2.querySelector('.mui-scroll').innerHTML = html2;
//			}, 500);
//		}
//	} else if(e.detail.slideNumber === 2) {
//		if(page1_item3.querySelector('.mui-loading')) {
//			setTimeout(function() {
//
//				page1_item3.querySelector('.mui-scroll').innerHTML = html3;
//			}, 500);
//		}
//	}
//
//});
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