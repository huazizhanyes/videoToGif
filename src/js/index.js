var flag = false;
var flag_loading = false;
window.onload = ()=> {
	var video;
	var canvas;
	var imglist = [];
	var gif = new GIF({
		workers: 2,
		quality: 10
	});
	btn.onclick = gifs
	function gifs() {
		loading(flag_loading = true)
		var timer = setInterval(()=> {
			video = document.getElementById("video");	//获取页面中的video元素
			canvas = document.createElement("canvas"); // 创建一个画布
			// canvas.width = video.videoWidth * 0.3;
			// canvas.height = video.videoHeight * 0.3;
			canvas.width = 500;
			canvas.height =  350;
			canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height); // getContext:设置画布环境；drawImage:画画
			var imgurl = canvas.toDataURL("image/png");
			gif.addFrame(canvas, { copy: true, delay: 200 })
			imglist.push(imgurl);
			console.log(imglist)
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
						console.log(blob);
						// donw(blob)
						video.pause()
						let gifImg = document.createElement('img')
						gifImg.src = URL.createObjectURL(blob)
						document.querySelector('.bottom_left').appendChild(gifImg)
						loading(flag_loading = false)
						// window.open(URL.createObjectURL(blob));
					});
					gif.render();
				}, 200)
			}
		}, 200)
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
function donw(blob) {
	const link = document.createElement('a')
	// 规定下载的超链接
	link.download = +new Date() + 'gif'
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

// 选取本地视频并创建播放器
function selectVideo() {
	var file = document.getElementById('file').files[0];
	if (!file) return;
	var url = URL.createObjectURL(file);
	console.log(url);
	let _video = document.createElement("video")
	_video.src = url;
	_video.classList.add('video')
	_video.setAttribute('controls', true)
	_video.setAttribute('id', 'video')
	document.querySelector('.video_box').appendChild(_video)
	isShowElsemnt(flag = true)
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
