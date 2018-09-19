mui.plusReady(function() {})

var tianjia = new Vue({
	el: '#tianjia',
	data: {
		content: "ruhe",
		price: "1",
		expiretime: "选择日期和时间",
		timestamp: "",
		tagsPicker: [{
			value: 'ywj',
			text: "学习"
		}, {
			value: "aaa",
			text: "快递"
		}, {
			value: "lj",
			text: "寻物"
		}],
		tags: [],
		tid:""
	},
	computed: {
		label: function() {
			return this.tags.join("")
		}
	}

});

document.getElementById('submit').addEventListener('tap', function() {
	if(tianjia.content == '' || tianjia.timestamp == '' || tianjia.price == "" || tianjia.label == "") {
		mui.toast('数据不完整!');
		return;
	}
	//var label=encodeURI((tianjia.label));
	//var content=encodeURI((tianjia.content));
	var req = {
		//action:"publish",
		label: tianjia.label,
		content: tianjia.content,
		price: parseFloat(tianjia.price),
		expiretime: tianjia.timestamp
	};
	console.log("req" + JSON.stringify(req));
	mui.ajax(common.url + "task?action=publish", {
		//data: req,
		data: JSON.stringify(req),
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		async: false,
		type: 'post', //HTTP请求类型
		timeout: 20000,
		success: function(data) {
			//获得服务器响应
			res = JSON.parse(data);
			if(res.suc < 0) {
				mui.toast('发布失败：' + data);
				console.log('发布失败：' + data);
			} else {
				console.log('发布成功：' + data);
				mui.toast('发布成功!');
				
				tianjia.tid=res.data.tid;
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；        02
			console.log('网络请求错误:' + type + JSON.stringify(xhr));
			if(type == 'timeout') {
				mui.toast('网络请求超时');
			} else {
				mui.toast('网络请求错误');
			}
		}
	});
	if(tianjia.tid==""){
		return;	
	}
	createUpload();

})

/*-----------------------------------*/

//截止时间
var result = mui('.picked_date')[0];
var btns = mui('.btn');
btns.each(function(i, btn) {
	btn.addEventListener('tap', function() {
		var _self = this;
		if(_self.picker) {
			_self.picker.show(function(rs) {
				result.innerText = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				result.innerText = rs.text;

				tianjia.expiretime = rs.text;
				var date = new Date((rs.text.replace(/-/g, "/")));;
				var timestamp = date.getTime() + "";
				tianjia.timestamp = timestamp.substring(0, 10);
				console.log('截止时间' + tianjia.timestamp);
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				_self.picker.dispose();
				_self.picker = null;
			});
		}

	}, false);
});

//选择方式
mui('body').on('tap', '.mui-radio', function(e) {
	this.children[1].setAttribute('checked', 'true');
	var str = "当前选中的为：" + this.children[0].innerText;
	mui.toast(str)
});

//是否匿名
document.getElementById('niming').addEventListener('toggle', function(event) {

	//event.detail.isActive 可直接获取当前状态
	var str = '状态：' + (event.detail.isActive ? 'true' : 'false');
	mui.toast(str);
});

//开始上传
function createUpload() {
	console.log("开始上传")
	console.log("index:" + index);
	var wt = plus.nativeUI.showWaiting();

	var task = plus.uploader.createUpload(common.url + "file?type=task&id="+tianjia.tid, {
			method: "POST",
			blocksize: 204800,
			priority: 100
		},
		function(t, status) {
			// 上传完成
			if(status == 200) {
				res = JSON.parse(t.responseText);
				console.log(res.suc);
				if(res.suc < 0) {
					console.log("上传失败: " + t.url + t.responseText);
					mui.toast('上传失败');
				} else {
					//console.log(setting.imgUrl)
					console.log("上传成功: " + t.url + t.responseText);
					mui.toast('上传成功');
					//
					var currentWebview = plus.webview.currentWebview();
					plus.webview.close(currentWebview, "zoom-fade-in", 200);
				}
				wt.close();
			} else {
				console.log("上传失败: " + status);
				mui.toast('上传失败');
				wt.close();
			}
		}
	);
	console.log("feedback.files.length" + feedback.files.length);
	console.log("文件"+JSON.stringify(feedback.files))
	for(var i = 0; i < feedback.files.length; i++) {
		
		task.addFile(feedback.files[i].path, {
			key: feedback.files[i].name
		});
	}
	//task.addData("upload", new Date());
	//task.addEventListener( "statechanged", onStateChanged, false );
	task.start();
}
/*------------------------------------------------*/
//选取相册图片
var index = 1;
var size = null;
var imageIndexIdNum = 0;
var starIndex = 0;
var feedback = {
	imageList: document.getElementById('image-list')
};
var url = 'https://service.dcloud.net.cn/feedback';
feedback.files = [];
feedback.uploader = null;
feedback.deviceInfo = null;
mui.plusReady(function() {
	//设备信息，无需修改
	feedback.deviceInfo = {
		appid: plus.runtime.appid,
		imei: plus.device.imei, //设备标识
		images: feedback.files, //图片文件
		p: mui.os.android ? 'a' : 'i', //平台类型，i表示iOS平台，a表示Android平台。
		md: plus.device.model, //设备型号
		app_version: plus.runtime.version,
		plus_version: plus.runtime.innerVersion, //基座版本号
		os: mui.os.version,
		net: '' + plus.networkinfo.getCurrentType()
	}
});
feedback.getFileInputArray = function() {
	return [].slice.call(feedback.imageList.querySelectorAll('.file'));
};
feedback.addFile = function(path) {
	feedback.files.push({
		name: "images" + index,
		path: path,
		id: "img-" + index
	});
	index++;
};
/**
 * 初始化图片域占位
 */
feedback.newPlaceholder = function() {
	var fileInputArray = feedback.getFileInputArray();
	if(fileInputArray &&
		fileInputArray.length > 0 &&
		fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
		return;
	};
	imageIndexIdNum++;
	var placeholder = document.createElement('div');
	placeholder.setAttribute('class', 'image-item space');
	var up = document.createElement("div");
	up.setAttribute('class', 'image-up')
	//删除图片
	var closeButton = document.createElement('div');
	closeButton.setAttribute('class', 'image-close');
	closeButton.innerHTML = 'X';
	closeButton.id = "img-" + index;
	//小X的点击事件
	closeButton.addEventListener('tap', function(event) {
		setTimeout(function() {
			for(var temp = 0; temp < feedback.files.length; temp++) {
				if(feedback.files[temp].id == closeButton.id) {
					feedback.files.splice(temp, 1);
				}
			}
			feedback.imageList.removeChild(placeholder);
		}, 0);
		return false;
	}, false);

	//
	var fileInput = document.createElement('div');
	fileInput.setAttribute('class', 'file');
	fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
	fileInput.addEventListener('tap', function(event) {
		var self = this;
		var index = (this.id).substr(-1);

		plus.gallery.pick(function(e) {
			//				console.log("event:"+e);
			var name = e.substr(e.lastIndexOf('/') + 1);
			console.log("name:" + name);

			plus.zip.compressImage({
				src: e,
				dst: '_doc/' + name,
				overwrite: true,
				quality: 50
			}, function(zip) {
				size += zip.size
				console.log("filesize:" + zip.size + ",totalsize:" + size);
				if(size > (10 * 1024 * 1024)) {
					return mui.toast('文件超大,请重新选择~');
				}
				if(!self.parentNode.classList.contains('space')) { //已有图片
					feedback.files.splice(index - 1, 1, {
						name: "images" + index,
						path: e
					});
				} else { //加号
					placeholder.classList.remove('space');
					feedback.addFile(zip.target);
					feedback.newPlaceholder();
				}
				up.classList.remove('image-up');
				placeholder.style.backgroundImage = 'url(' + zip.target + ')';
			}, function(zipe) {
				mui.toast('压缩失败！')
			});

		}, function(e) {
			mui.toast(e.message);
		}, {});
	}, false);
	placeholder.appendChild(closeButton);
	placeholder.appendChild(up);
	placeholder.appendChild(fileInput);
	feedback.imageList.appendChild(placeholder);
};
feedback.newPlaceholder();

/*------------------------------------------------*/

//获取定位信息
var location_state = 0;
//console.log('初始location_state：' + location_state);
document.getElementById('location').addEventListener('tap', function() {
	console.log(location_state);

	if(location_state == 0) {
		//添加定位信息
		var btnArray = ['是', '否'];
		mui.confirm('添加定位信息，确认？', '定位信息', btnArray, function(e) {
			if(e.index == 0) {
				//添加定位信息
				mui.toast('你刚确认获取定位信息');
				plus.geolocation.getCurrentPosition(function(p) {
					// 创建地图坐标对象
					var point = new plus.maps.Point(p.coords.longitude, p.coords.latitude);
					//						('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
					plus.maps.Map.reverseGeocode(point, {}, function(event) {
						var address = event.address; // 转换后的地理位置
						var point = event.coord; // 转换后的坐标信息
						var coordType = event.coordType; // 转换后的坐标系类型

						location_state = 1;
						document.getElementById('location').innerText = address;
						console.log("Address:" + address);
					}, function(e) {
						console.log("Failed:" + JSON.stringify(e));
					});
				}, function(e) {
					console.log('Geolocation error: ' + e.message);
				});

			} else {
				mui.toast('已取消获取定位')
			}
		})
	} else {
		//删除定位信息
		var btnArray = [{
			title: "删除定位信息",
			style: "destructive"
		}];
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			var text = "你刚点击了\"";
			switch(index) {
				case 0:
					/*mui.toast('已取消');*/
					break;
				case 1:
					//删除定位信息
					document.getElementById('location').innerText = '添加定位';
					mui.toast('已删除定位信息');
					location_state = 0;
					break;
			}
		});
	}

});

//添加标签
var tagsPicker = new mui.PopPicker();
tagsPicker.setData(tianjia.tagsPicker);
var tagsResultObj;
var tagsResultString;
var add_box = document.getElementsByClassName('add_box')[0];
var newTag;
var thisTag;
//var tags = new Array();
var tags = tianjia.tags;
mui('body').on('tap', '.tags', function(event) {
	console.log(this.innerText);
	thisTag = this;
	if(this.innerText == '添加标签') {
		tagsPicker.show(function(items) {
			tagsResultString = JSON.stringify(items[0]);
			tagsResultObj = JSON.parse(tagsResultString);
			console.log(tagsResultObj.text);

			for(var i = 0, len = tags.length; i < len; i++) {
				if(tags[i] == tagsResultObj.text) {
					mui.toast('该标签已存在')
					return;
				}
			}
			tags.push(tagsResultObj.text);
			console.log('已存在标签：' + tags);
			newTag = document.createElement('button');
			newTag.className = 'mui-icon mui-icon-compose tags';
			newTag.innerText = tagsResultObj.text;
			add_box.insertBefore(newTag, thisTag);
			mui.toast('添加标签成功');
		});
	} else {
		//删除标签
		var btnArray = [{
			title: "删除标签",
			style: "destructive"
		}];
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: btnArray
		}, function(e) {
			var index = e.index;
			switch(index) {
				case 0:
					//						mui.toast('已取消');
					break;
				case 1:
					//删除标签
					for(var i = 0, len = tags.length; i < len; i++) {
						if(tags[i] == tagsResultObj.text) {
							tags[i] == thisTag.innerText;
							tags.splice(i, 1);
						}
					}
					console.log('剩余标签：' + tags);
					add_box.removeChild(thisTag);
					mui.toast('已删除该标签');
					break;
			}
		});
	}
}, false);