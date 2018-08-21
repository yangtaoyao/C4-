mui.plusReady(function() {
	//				var nb = plus.webview.currentWebview().getTitleNView();
	//				nb.drawText('返回', {
	//					'top': '0px',
	//					'left': '8px',
	//					'width': '96px',
	//					'height': '100%'
	//				}, {
	//					'color': '#eee'
	//				});

})

mui.init({
	swipeBack: false
});
(function($) {
	/*// 销毁默认的组件
	var component = mui('.mui-bar-transparent').transparent();
	component.destory();
	// 重新初始化组件
	mui('.mui-bar-transparent').transparent({
		scrollby: document.getElementById('scroll_main') //这里传scroll的容器元素
	});

	$('#scroll_main').scroll({
		indicators: true, //是否显示滚动条
		bounce: false,
		startY: 0,

	});*/

	$('.mui-scroll-wrapper').scroll();

	var html2 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第二个选项卡子项-1</li><li class="mui-table-view-cell">第二个选项卡子项-2</li><li class="mui-table-view-cell">第二个选项卡子项-3</li><li class="mui-table-view-cell">第二个选项卡子项-4</li><li class="mui-table-view-cell">第二个选项卡子项-5</li></ul>';
	var html3 = '<ul class="mui-table-view"><li class="mui-table-view-cell">第三个选项卡子项-1</li><li class="mui-table-view-cell">第三个选项卡子项-2</li><li class="mui-table-view-cell">第三个选项卡子项-3</li><li class="mui-table-view-cell">第三个选项卡子项-4</li><li class="mui-table-view-cell">第三个选项卡子项-5</li></ul>';
	var item2 = document.getElementById('item2mobile');
	var item3 = document.getElementById('item3mobile');
	document.getElementById('slider').addEventListener('slide', function(e) {
		if(e.detail.slideNumber === 1) {
			if(item2.querySelector('.mui-loading')) {
				setTimeout(function() {
					item2.querySelector('.mui-scroll').innerHTML = html2;
				}, 500);
			}
		} else if(e.detail.slideNumber === 2) {
			if(item3.querySelector('.mui-loading')) {
				setTimeout(function() {
					item3.querySelector('.mui-scroll').innerHTML = html3;
				}, 500);
			}
		}
	});

	//选项卡顶部bar滚动吸附效果
	var scroll_main = $('.mui-content')[0];
	var mui_segmented_control = document.getElementById('sliderSegmentedControl');
	var sliderProgressBar = document.getElementById('sliderProgressBar');
	var slider_group = document.getElementsByClassName('mui-slider-group')[0];
	document.addEventListener('scroll', function(e) {
		//mui_segmented_control.style.position='fixed';
		if(window.scrollY >= 282) {
			console.log(window.scrollY)

			slider_group.style.marginTop = '42px';
			sliderProgressBar.style.position = 'fixed';
			sliderProgressBar.classList.add('sliderProgressBar_fixed');

			mui_segmented_control.style.position = 'fixed';
			mui_segmented_control.classList.add('slider_fixed_top');
		} else {

			mui_segmented_control.style.position = 'relative';
			mui_segmented_control.classList.remove('slider_fixed_top');

			sliderProgressBar.style.position = 'relative';
			sliderProgressBar.classList.remove('sliderProgressBar_fixed');
			slider_group.style.marginTop = '0';
		}
	})

	//封面图片cover更换
	var cover = $('.cover')[0];
	var btnArray = [{
			title: "更换封面",
		},
		{
			title: "保存到相册",
		}
	];
	cover.addEventListener('tap', function() {
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: btnArray,
		}, function(e) {
			var index = e.index;
			switch(index) {
				case 0:
					/*mui.toast('已取消');*/
					break;
				case 1:
					// 从相册中选择图片
					plus.gallery.pick(function(path) {
						console.log('选取图片路径：' + path);
						cover.style.backgroundImage = "url(" + path + ")";
						mui.toast('更换成功');
					}, function(e) {
						mui.toast('已取消');
					}, {
						filter: "image",
					});
					break;
				case 2:
					// 保存到相册
					var currCss = window.getComputedStyle(cover, null);
					currPath = currCss.backgroundImage.replace('url("', '').replace('")', '');
					//					console.log(currCss.backgroundImage)
					//					console.log(currPath)
					plus.gallery.save(currPath, function() {
						$.toast("保存成功");
					});
					break;
			}
		});
	})

	//跳转修改资料
	document.getElementById('goto_perData').addEventListener('tap', function() {
		$.openWindow({
			id: 'perData.html',
			url: 'perData.html',
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
		})
	})
})(mui);