var flag = false;
var flag_loading = false;
var video;
var canvas;
var gifImgSrc;
var blobs;
var fileNames;
// 分辨率
var resolut = [null, null]
// 动画速度
var speed = 150
// 画质
var quality = 20
// 流畅度
var smooth = 200
window.onload = ()=> {
	var imglist = [];
	var gif = new GIF({
		workers: 2,
		quality: quality
	});
	btn.onclick = gifs
	function gifs() {
		loading(flag_loading = true)
		var timer = setInterval(()=> {
			video = document.getElementById("video");	//获取页面中的video元素
			canvas = document.createElement("canvas"); // 创建一个画布
			if (resolut[0] && resolut[1]) {
				canvas.width = resolut[0]
				canvas.height = resolut[1]
			} else {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
			}
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); // getContext:设置画布环境；drawImage:画画
			var imgurl = canvas.toDataURL("image/png");
			gif.addFrame(canvas, { copy: true, delay: speed })
			imglist.push(imgurl);
			video.play()
			if (imglist.length > 20) {
				// 添加显示
				for (let _x = 0; _x < imglist.length; _x++) {
					let _img = document.createElement("img")
					_img.src = imglist[_x]
					_img.classList.add('image')
					document.querySelector('.top_right').appendChild(_img)

				}
				clearInterval(timer);
				setTimeout(function () {
					gif.on('finished', function (blob) {
						console.log(imglist)
						console.log(blob);
						blobs = blob
						video.pause()
						let gifImg = document.createElement('img')
						gifImg.src = URL.createObjectURL(blob)
						gifImgSrc = URL.createObjectURL(blob)
						document.querySelector('.bottom_left').appendChild(gifImg)
						loading(flag_loading = false)
						fileNames = +new Date() + '.gif'
						_dowonLoad(bytesToSize(blob.size), fileNames, blob)
					});
					gif.render();
				}, 200)
			}
		}, smooth)
	}
}

// loding加载动画
function loading(flag_loading){
	let loiding_wrap = document.querySelector('.loiding_wrap')
	if (flag_loading) {
		loiding_wrap.style.display = 'block'
	} else {
		loiding_wrap.style.display = 'none'
	}
}

// 下载gif
function donw(blob, fileNames) {
	const link = document.createElement('a')
	// 规定下载的超链接
	link.download = fileNames
	// 未点击前隐藏a链接
	link.style.display = 'none'
	// 创建URL对象，指向该文件url
	link.href = URL.createObjectURL(blob)
	// 将a标签添加到dom中
	document.body.append(link)
	// 触发a标签点击事件
	link.click()
	// 释放之前的URL对象
	URL.revokeObjectURL(link.href)
	// 从dom中移除该a链接
	document.body.removeChild(link)
}

// 查看gif
function lookPic (blob) {
	window.open(URL.createObjectURL(blob));
}

// 选取本地视频并创建播放器
function selectVideo() {
	var file = document.getElementById('file').files[0];
	if (!file) return;
	var url = URL.createObjectURL(file);
	console.log(url);
	let _video = document.createElement("video")
	_video.src = url;
	_video.classList.add('video')
	_video.setAttribute('id', 'video')
	_video.muted = true;
	_video.controls = true;
	// 视频加载完毕时
	_video.addEventListener('loadedmetadata', (e) => {
		console.log(parseInt(_video.duration));
		let _range = document.querySelector('#range')
		_range.max = _video.duration
	})
	document.querySelector('.video_box').appendChild(_video)
	isShowElsemnt(flag = true)
}

// 进度条处理
function ranges() {
	let inner = document.querySelector('.range_inner')
	let _range = document.querySelector('#range')
	let _video = document.querySelector('.video')
	inner.innerHTML = _range.value + 's'
	_video.currentTime = _range.value
}

// 控制面板元素显示或者隐藏
function isShowElsemnt(flag) {
	let _select_video = document.querySelector('.select_video')
	let _console_wrap = document.querySelector('.console_wrap')
	let _top_rightP = document.querySelector('.top_right p')
	if (flag) {
		_select_video.style.display = 'none'
		_console_wrap.style.display = 'block'
		_top_rightP.style.display = 'none'
	}else {
		_select_video.style.display = 'block'
		_console_wrap.style.display = 'none'
		_top_rightP.style.display = 'block'
	}
}


// 分辨率大小
function selectOpt() {
	let select = document.getElementById('selectopt');
	let index=  select.selectedIndex; 
	let val = select.options[index].value;
	let str = val.split('x')
	console.log(val);
	if (val == '保持原尺寸') {
		resolut[0] = null
		resolut[1] = null
	}
	resolut[0] = str[0]
	resolut[1] = str[1]
}

// 动画速度
function selectspeed(){
	let selectspeed = document.getElementById('selectspeed');
	let index=  selectspeed.selectedIndex; 
	let val = selectspeed.options[index].value;
	console.log(val);
	if (val == '正常') {
		speed = 150
	} else if (val == '慢') {
		speed = 400
	}
	else if (val == '中') {
		speed = 300
	}else if (val == '快') {
		speed = 80
	}
	else if (val == '较快') {
		speed = 10
	}
}

// 画质
function selectmass() {
	let selectmass = document.getElementById('selectmass');
	let index=  selectmass.selectedIndex; 
	let val = selectmass.options[index].value;
	console.log(val);
	if(val == '高') {
		quality = 30
	}else if ('中'){
		quality = 20
	}else {
		quality = 1
	}
}

// 流畅度
function selectsmooth() {
	let selectsmooth = document.getElementById('selectsmooth');
	let index=  selectsmooth.selectedIndex; 
	let val = selectsmooth.options[index].value;
	console.log(val);
	if(val == '正常') {
		smooth = 200
	} else {
		quality = 50
	}
}

// 字节转换
function bytesToSize(bytes) {
	if (bytes === 0) {
	 return '0 B';
	 }

	 let k = 1024;

	 let sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	 let i = Math.floor(Math.log(bytes) / Math.log(k));
	 let num = (bytes / Math.pow(k, i)).toFixed(1) > Math.floor((bytes / Math.pow(k, i))) ?
		 (bytes / Math.pow(k, i)).toFixed(1) : Math.floor((bytes / Math.pow(k, i)));
		 console.log(num + ' ' + sizes[i]);
	 return num + ' ' + sizes[i];
 }

//  添加下载链接
function _dowonLoad(size, fileName = 'text') {
	let _box = document.querySelector('.wrap_post')
	let innerTxt = `
		<div class="box-file">
			<p>输出文件</p>
			<div>
				<span>${fileName}</span>
			</div>
		</div>
		<div class="box-file">
			<p>文件大小</p>
			<div>
				<span>${size}</span>
			</div>
		</div>
		<div class="box-file">
			<p>操作</p>
			<div>
				<span onclick="lookP()" style="cursor: pointer;" id="lookPics">预览</span>
				<span onclick="downP()" style="cursor: pointer;" id="donws">下载</span>
			</div>
		</div>
	`
	_box.innerHTML = innerTxt
	isBlobs = true
}
function lookP() {
	console.log(1111111);
	lookPic(blobs)
}
function downP() {
	console.log(222);
	donw(blobs, fileNames)

}
