mui.init();
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#setting'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();

setTimeout(function() {
	defaultImg();
	setTimeout(function() {
		initImgPreview();
	}, 300);
}, 500);

var view = viewApi.view;
(function($) {
	//处理view的后退与webview后退
	var oldBack = $.back;
	$.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			oldBack();
		}
	};
	//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
	//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
	view.addEventListener('pageBeforeShow', function(e) {
		//				console.log(e.detail.page.id + ' beforeShow');
	});
	view.addEventListener('pageShow', function(e) {
		//				console.log(e.detail.page.id + ' show');
	});
	view.addEventListener('pageBeforeBack', function(e) {
		//				console.log(e.detail.page.id + ' beforeBack');
	});
	view.addEventListener('pageBack', function(e) {
		//				console.log(e.detail.page.id + ' back');
	});
	
	
})(mui);
//更换头像
mui(".mui-table-view-cell").on("tap", "#head", function(e) {
	if(mui.os.plus) {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "修改头像",
			cancel: "取消",
			buttons: a
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					getImage();
					break;
				case 2:
					galleryImg();
					break;
				default:
					break
			}
		})
	}

});

function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			var s = entry.toLocalURL() + "?version=" + new Date().getTime();
			console.log(s);
			document.getElementById("head-img").src = s;

			//变更大图预览的src
			//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
			document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();;;
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(s) {
		console.log("error" + s);
	}, {
		filename: "_doc/head.jpg"
	})
}

function galleryImg() {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile("head.jpg", {}, function(file) {
					//文件已存在
					file.remove(function() {
						console.log("file remove success");
						entry.copyTo(root, 'head.jpg', function(e) {
								var e = e.fullPath + "?version=" + new Date().getTime();
								document.getElementById("head-img").src = e;

								//变更大图预览的src
								//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
								document.querySelector("#__mui-imageview__group .mui-slider-item img").src = e + "?version=" + new Date().getTime();;
							},
							function(e) {
								console.log('copy image fail:' + e.message);
							});
					}, function() {
						console.log("delete image fail:" + e.message);
					});
				}, function() {
					//文件不存在
					entry.copyTo(root, 'head.jpg', function(e) {
							var path = e.fullPath + "?version=" + new Date().getTime();
							document.getElementById("head-img").src = path;

							//变更大图预览的src
							//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
							document.querySelector("#__mui-imageview__group .mui-slider-item img").src = path;
						},
						function(e) {
							console.log('copy image fail:' + e.message);
						});
				});
			}, function(e) {
				console.log("get _www folder fail");
			})
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(a) {}, {
		filter: "image"
	})
};

function defaultImg() {
	if(mui.os.plus) {
		plus.io.resolveLocalFileSystemURL("_doc/head.jpg", function(entry) {
			var s = entry.fullPath + "?version=" + new Date().getTime();;
			document.getElementById("head-img").src = s;
		}, function(e) {
			document.getElementById("head-img").src = 'images/u445.png';

		})
	} else {
		document.getElementById("head-img").src = 'images/u445.png';
	}

}
document.getElementById("head-img").addEventListener('tap', function(e) {
	e.stopPropagation();
});

function initImgPreview() {
	var imgs = document.querySelectorAll("img.mui-action-preview");
	imgs = mui.slice.call(imgs);
	if(imgs && imgs.length > 0) {
		var slider = document.createElement("div");
		slider.setAttribute("id", "__mui-imageview__");
		slider.classList.add("mui-slider");
		slider.classList.add("mui-fullscreen");
		slider.style.display = "none";
		slider.addEventListener("tap", function() {
			slider.style.display = "none";
		});
		slider.addEventListener("touchmove", function(event) {
			event.preventDefault();
		})
		var slider_group = document.createElement("div");
		slider_group.setAttribute("id", "__mui-imageview__group");
		slider_group.classList.add("mui-slider-group");
		imgs.forEach(function(value, index, array) {
			//给图片添加点击事件，触发预览显示；
			value.addEventListener('tap', function() {
				slider.style.display = "block";
				_slider.refresh();
				_slider.gotoItem(index, 0);
			})
			var item = document.createElement("div");
			item.classList.add("mui-slider-item");
			var a = document.createElement("a");
			var img = document.createElement("img");
			img.setAttribute("src", value.src);
			a.appendChild(img)
			item.appendChild(a);
			slider_group.appendChild(item);
		});
		slider.appendChild(slider_group);
		document.body.appendChild(slider);
		var _slider = mui(slider).slider();
	}
}

//修改昵称
document.getElementById("name").addEventListener('tap', function(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	var name = this.children[0];
	mui.prompt("更改昵称", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			//console.log(e.value);
			if(e.value == "") {
				mui.toast('昵称不能为空');
			} else {
				name.innerText = e.value;
				myStorage.setItem('name', e.value);
				mui.toast('修改成功');
			}

		} else {
			mui.toast('已取消');
		}
	})

});
//修改签名
document.getElementById("signature").addEventListener('tap', function(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	var inode = this.children[0];
	mui.prompt("更改签名", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			if(e.value == "") {
				inode.innerText = '暂时没想到写点什么';
				myStorage.setItem('signature', '暂时没想到写点什么');
			}else{
				inode.innerText = e.value;
				myStorage.setItem('signature', e.value);
				mui.toast('修改成功');
			}
		} else {
			mui.toast('已取消');
		}
	})

});
//修改年龄
document.getElementById("age").addEventListener('tap', function(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	var inode = this.children[0];
	mui.prompt("更改年龄", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			if(e.value == "") {
				mui.toast('年龄不能为空');
			} else {
				inode.innerText = e.value;
				myStorage.setItem('age',e.value);
				mui.toast('修改成功');
			}
		} else {
			mui.toast('已取消');
		}
	})

});
//修改邮箱
document.getElementById("email").addEventListener('tap', function(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	var inode = this.children[0];
	mui.prompt("更改邮箱", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			inode.innerText = e.value;
			myStorage.setItem('email',e.value);
			mui.toast('修改成功');
		} else {
			mui.toast('已取消');
		}
	})

});

//


mui.plusReady(function() {
	//初始化数据
	initData();
	console.log(myStorage.getLength())

	for(var i = 0, len = myStorage.getLength(); i < len; i++) {
		console.log(JSON.stringify(myStorage.getItemByIndex(i)))
	}
	//myStorage.clear();
	console.log(myStorage.getLength())
});

//所在地
var cityPicker = new mui.PopPicker({
	layer: 2
});
cityPicker.setData(cityData);
document.getElementById("showCityPicker").addEventListener('tap', function(e) {
	var inode = this.children[0];
	cityPicker.show(function(items) {
		//console.log("你选择的城市是:" + items[0].text + " " + items[1].text)
		inode.innerText = items[0].text + " " + items[1].text;
		myStorage.setItem('city', items[0].text + " " + items[1].text);
		//返回 false 可以阻止选择框的关闭
		//return true;
	});
}, false);
//性别
var sexPicker = new mui.PopPicker({
	layer: 1
});
sexPicker.setData([{
	value: 'men',
	text: '男'
},{
	value: 'women',
	text: '女'
}]);
document.getElementById("sex").addEventListener('tap', function(e) {
	var inode = this.children[0];
	sexPicker.show(function(items) {
		inode.innerText = items[0].text;
		myStorage.setItem('sex', items[0].text);
		//返回 false 可以阻止选择框的关闭
		//return true;
	});
}, false);

//初始化数据
function initData(){
	(document.getElementById('name').children[0]).innerText=myStorage.getItem('name');
	(document.getElementById('signature').children[0]).innerText=myStorage.getItem('signature');
	(document.getElementById('sex').children[0]).innerText=myStorage.getItem('sex');
	(document.getElementById('age').children[0]).innerText=myStorage.getItem('age');
	(document.getElementById('showCityPicker').children[0]).innerText=myStorage.getItem('city');
	(document.getElementById('email').children[0]).innerText=myStorage.getItem('email');
}
