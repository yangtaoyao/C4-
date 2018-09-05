var slider = mui("#slider ");
slider.slider({
	interval: 5000
});
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			style: 'circle',
			callback: pulldownRefresh
		},
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	},

});

var count = 0;

//上拉刷新
function pullupRefresh() {
	setTimeout(function() {
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 10)); //参数为true代表没有更多数据了。
		var table = document.body.querySelector('.list02');
		var cells = document.body.querySelectorAll('.home-table-view-cell');
		var newCount = cells.length > 0 ? 5 : 20; //首次加载20条，满屏
		for(var i = cells.length, len = i + newCount; i < len; i++) {
			var li = document.createElement('li');
			li.className = 'home-table-view-cell';
			li.innerHTML =
				'<a href="#" class="home-card ">' +
				'<div class="home-card-left ">' +
				'<span>最急</span>' +
				'<img src="images/kuaidiicon.png" />' +
				'<p>学习</p>' +
				'</div>' +
				'<div class="home-card-right ">' +
				'<h5>帮帮单' + Math.ceil(10 * Math.random()) + '</h5>' +
				'<p class="deadline"><span>截止 </span><span >' + new Date() + '</span></p>' +
				'<p ><span class="reward">¥8.00</span><span class="participants">' + Math.ceil(10 * Math.random()) + '人</span></p>' +
				'</div>' +
				'</a>';

			var a = li.getElementsByTagName('a')[0];
			var span = (a.children[0]).getElementsByTagName('span')[0];
			var img = (a.children[0]).getElementsByTagName('img')[0];
			var p = (a.children[0]).getElementsByTagName('p')[0];
			//更新数据
			a.src = 'index-subpage-wode.html';
			span = '最新';
			var imgs = ['images/xuexi.png', 'images/xuexiicon.png', 'images/xunwuicon.png', 'images/kuaidiicon.png', 'images/jietiicon.png']
			img.src = imgs[parseInt(Math.random() * 5)];

			table.appendChild(li);
		}
	}, 1500);
}

function addData() {
	var table = document.body.querySelector('.mui-table-view');
	var cells = document.body.querySelectorAll('.home-table-view-cell');
	for(var i = cells.length, len = i + 5; i < len; i++) {
		var li = document.createElement('li');
		li.className = 'home-table-view-cell';
		li.innerHTML = '<a href="# " class="home-card ">' +
			'<div class="home-card-left ">' +
			'<span>热门</span>' +
			'<img src="images/xuexi.png " />' +
			'<p>学习</p>' +
			'</div>' +
			'<div class="home-card-right ">' +
			'<span>日新楼帮忙去快递</span>' +
			'<p><span>截止时间:</span><span>' + +'</span></p>' +
			'<p><span>赏金:</span><span>' + +'</span></p>' +
			'<p><span>正在竞标：</span><span>' + +'人</span></p>' +
			'</div>' +
			'</a>';
		//	
		var a = li.getElementsByTagName('a')[0];
		var span = (a.children[0]).getElementsByTagName('span')[0];
		var img = (a.children[0]).getElementsByTagName('img')[0];
		var p = (a.children[0]).getElementsByTagName('p')[0];
		//更新数据
		a.src = 'index-subpage-wode.html';
		span = '最新';
		var imgs = ['images/xuexi.png', 'images/xuexiicon.png', 'images/xunwuicon.png', 'images/kuaidiicon.png', 'images/jietiicon.png']
		img.src = imgs[parseInt(Math.random() * 5)];

		//下拉刷新，新纪录插到最前面；
		table.insertBefore(li, table.firstChild);
	}
}
/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		addData();
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		mui.toast("为你更新了5个最新任务 ");
	}, 1500);
}

/**
 * 点击进入新窗口
 */
mui.plusReady(function() {

	webview_detail = mui.preload({
		url: 'index-subpage-home-detail.html',
		id: 'detail',
		styles: {
			"render": "always",
			"popGesture": "hide",
			"bounce": "vertical",
			"bounceBackground": "#efeff4",
		}
	});

	var detailPage = null;
	//添加列表项的点击事件
	mui('.mui-content').on('tap', '.home-card', function(e) {
		var id = this.getAttribute('id');
		//获得详情页面
		if(!detailPage) {
			detailPage = plus.webview.getWebviewById('index-subpage-home-detail.html');
		}
		//触发详情页面的newsId事件
		mui.fire(detailPage, 'newsId', {
			id: id
		});
		//打开详情页面          
		mui.openWindow({
			url: 'index-subpage-home-detail.html',
			id: 'detail',
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

	});

	var ranking_btn = document.getElementById("ranking");
	var assortment_btn = document.getElementById("assortment");
	var searching_btn = document.getElementById("searching");
	//监听点击事件
	ranking_btn.addEventListener("tap", function() {
		console.log('ranking')
		mui.openWindow({
			id: 'detail.html',
			url: 'index-subpage-home-ranking.html',
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
	});

	assortment_btn.addEventListener("tap", function() {

		mui.openWindow({
			id: 'detail.html',
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
	});

	searching_btn.addEventListener("tap", function() {

		mui.openWindow({
			id: 'detail.html',
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
	});

})

/*mui.ajax('', {
	data: {
		username: 'username',
		password: 'password'
	},
	dataType: 'json', //服务器返回json格式数据
	type: 'post', //HTTP请求类型
	timeout: 10000, //超时时间设置为10秒；
	success: function(data) {
		//服务器返回响应，根据响应结果，分析是否登录成功；
		...
	},
	error: function(xhr, type, errorThrown) {
		//异常处理；
		console.log(type);
	}
});*/