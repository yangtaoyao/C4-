mui.init();
mui.plusReady(function() {
	//初始化数据
	//console.log(myStorage.getLength())
	//	for(var i = 0, len = myStorage.getLength(); i < len; i++) {
	//		console.log(JSON.stringify(myStorage.getItemByIndex(i)))
	//	}
	//myStorage.clear();
	//console.log('myStorage.getLength():' + myStorage.getLength())
});

//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#setting'
});

var setting = new Vue({
	el: '#setting',
	data: {
		uid: ' ',
		nickname: '',
		signature: '',
		sex: ' ',
		age: ' ',
		city: ' ',
		email: ' ',
		imgUrl: ' ',
		tel: ' '
	},
	computed: {

	}
});
var perIndruction = new Vue({
	el: '#perIndruction',
	data: {
		description: ''
	},
	computed: {

	}
});
/*
 * 返回保存信息
 */
mui.back = function() {
	if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
		viewApi.back();
	} else { //执行webview后退
		var userInfo = JSON.parse(myStorage.getItem("userInfo"));
		userInfo.nickname = setting.nickname;
		userInfo.signature = setting.signature;
		userInfo.sex = setting.sex;
		userInfo.age = setting.age;
		userInfo.city = setting.city;
		userInfo.email = setting.email;
		userInfo.imgUrl = setting.imgUrl;
		userInfo.description = perIndruction.description;
		myStorage.setItem("userInfo", JSON.stringify(userInfo));
		console.log(JSON.stringify(myStorage.getItem("userInfo")));
		//更新我的页面
		var Webv_wode = plus.webview.getWebviewById("index-subpage-wode.html");
		Webv_wode.evalJS('initInfo()');

		var currentWebview = plus.webview.currentWebview();
		plus.webview.close(currentWebview, "slide-out-right", 200);
		//changeInfo();
		//createUpload(userInfo.imgUrl);
	}
};

function createUpload(doc_url,key_str) {
	console.log("开始上传")
	var wt = plus.nativeUI.showWaiting();
	var task = plus.uploader.createUpload(common.url + "file?type=user", {
			method: "POST",
			blocksize: 204800,
			priority: 100
		},
		function(t, status) {
			// 上传完成
			if(status == 200) {
				res=JSON.parse(t.responseText);
				console.log(res.suc);
				if(res.suc<0){
					console.log("上传头像失败: " + t.url+t.responseText);
					mui.toast('上传头像失败');
				}else{
					console.log("上传头像成功: " + t.url+t.responseText);
					mui.toast('上传头像成功');
				}
				wt.close();
			} else {
				console.log("上传头像失败: " + status);
				mui.toast('上传头像失败');
				wt.close();
			}
		}
	);
	task.addFile(doc_url, {
		key: key_str
	});
	//task.addData("upload", new Date());
	//task.addEventListener( "statechanged", onStateChanged, false );
	task.start();
}

initData();
//初始化数据
function initData() {
	var userInfo = JSON.parse(myStorage.getItem("userInfo"));
	
		var str = myStorage.getItem("userInfo");
		console.log(str);
	

	setting.nickname = userInfo.nickname;
	setting.signature = userInfo.signature;
	setting.sex = userInfo.sex;
	setting.age = userInfo.age;
	setting.city = userInfo.city;
	setting.email = userInfo.email;
	perIndruction.description = userInfo.description;

}
function changeInfo() {
	console.log(setting.nickname == "" ? " " : setting.nickname);
	req = {
		//action: 'changeInfo',
		//		info:myStorage.getItem("userInfo")
		nickname: setting.nickname == "" ? " " : setting.nickname,
		signature: setting.signature == "" ? " " : setting.signature,
		sex: setting.sex == "" ? " " : setting.sex,
		age: setting.age == "" ? " " : setting.age,
		city: setting.city == "" ? " " : setting.city,
		email: setting.email == "" ? " " : setting.email,
		imgUrl: setting.imgUrl == "" ? " " : setting.imgUrl,
		description: perIndruction.description == "" ? " " : perIndruction.description,
	};
	console.log('req:' + JSON.stringify(req));
	mui.ajax(common.url + 'user?action=changeInfo', {
		data: JSON.stringify(req),
		type: 'post', //HTTP请求类型
		timeout: 20000,
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			console.log('res:' + data);
			if(res.suc < 0) {
				mui.toast('修改失败：' + JSON.stringify(res));
				console.log('修改失败：' + JSON.stringify(res));
			} else {
				console.log('修改成功：' + JSON.stringify(res));
				mui.toast('修改成功!');

			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；        02
			console.log('网络请求错误:' + type);
			if(type == 'timeout') {
				mui.toast('网络请求超时');
			} else {
				mui.toast('网络请求错误');
			}

		}
	});
}
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();

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

/*-------------------------------------------------------*/
setTimeout(function() {
	defaultImg();
	setTimeout(function() {
		initImgPreview();
	}, 300);
}, 500);

//更换头像
function setHeadImg() {
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

}

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
								//document.getElementById("head-img").src = e;

								setting.imgUrl = e;
								console.log('head-img path e:' + e)
								createUpload(setting.imgUrl,"head_img");
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
							//document.getElementById("head-img").src = path;

							setting.imgUrl = path;
							console.log('head-img path:' + path);
							
							createUpload(userInfo.imgUrl,"head_img");
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
}

//默认图片
function defaultImg() {
	if(mui.os.plus) {
		plus.io.resolveLocalFileSystemURL("_doc/head.jpg", function(entry) {
			var s = entry.fullPath + "?version=" + new Date().getTime();;
			setting.imgUrl = s;
		}, function(e) {
			setting.imgUrl = 'images/u445.png';
		})
	} else {
		setting.imgUrl = 'images/u445.png';
	}

}

//图片预览
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
/*-------------------------------------------------------*/
//修改昵称
function setName(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	mui.prompt("更改昵称", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			//console.log(e.value);
			if(e.value == "") {
				mui.toast('还没设置昵称呢');
				setting.nickname = "还没设置昵称呢";
			} else {
				setting.nickname = e.value;
				mui.toast('修改成功');
			}

		} else {
			mui.toast('已取消');
		}
	})

}
//修改签名
function setSignature(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	mui.prompt("更改签名", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			if(e.value == "") {
				setting.signature = '暂时没想到写点什么？';
			} else {
				setting.signature = e.value;
				mui.toast('修改成功');
			}
		} else {
			mui.toast('已取消');
		}
	})

}
//更改简介
function desc_save(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var text = perIndruction.description;
	if(text == "") {
		perIndruction.description = '这个人很懒，什么也没留下';
	} else {
		perIndruction.description = e.value;
	}
	mui.toast('保存成功');
	viewApi.back()
	console.log(perIndruction.description)
}

//修改年龄
function setAge(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	mui.prompt("更改年龄", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			if(e.value == "") {
				mui.toast('年龄不能为空');
			} else {
				setting.age = e.value;
				mui.toast('修改成功');
			}
		} else {
			mui.toast('已取消');
		}
	})

}
//修改邮箱
function setEmail(e) {
	e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
	var btnArray = ['确定', '取消'];
	mui.prompt("更改邮箱", "", "更改提示", btnArray, function(e) {
		if(e.index == 0) {
			setting.email = e.value;
			mui.toast('修改成功');
		} else {
			mui.toast('已取消');
		}
	})

}

//

//所在地
var cityPicker = new mui.PopPicker({
	layer: 2
});
cityPicker.setData(cityData);

function showCityPicker(e) {
	cityPicker.show(function(items) {
		//console.log("你选择的城市是:" + items[0].text + " " + items[1].text)
		setting.city = items[0].text + " " + items[1].text;
		//返回 false 可以阻止选择框的关闭
		//return true;
	});
}
//性别
var sexPicker = new mui.PopPicker({
	layer: 1
});
sexPicker.setData([{
	value: 'men',
	text: '男'
}, {
	value: 'women',
	text: '女'
}]);

function setSex(e) {
	sexPicker.show(function(items) {
		setting.sex = items[0].text;
		//返回 false 可以阻止选择框的关闭
		//return true;
	});
}


