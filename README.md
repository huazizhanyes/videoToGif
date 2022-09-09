<p>一款视频转gif的小工具，可调节开始时间、持续帧、分辨率、动画速度、流畅度、质量，支持在线预览、下载等</p>
<p align="left"><img style="border-radius:5px;" src="https://huazizhanye.oss-cn-beijing.aliyuncs.com/blogs/images/videoToGif/dow_gif.gif"/></p>

<!-- more -->
- 体验地址 - <http://gif.hzzy.xyz/>

很多时候看到视频中的某个片段，觉得特别搞笑，就想做成表情包，可是很多视频转gif的网站都要收费，登录注册之类的，很是脑壳疼，于是乎，我决定用 `gif.js` 自己制作一个

- gif.js 官网 - <https://jnordberg.github.io/gif.js/>
  
原理：创建canvas画布获取视频的帧数和预览帧的`blob`，再利用 `gif.js` 将每一帧动画的 blob 组合起来就生成了gif 动画。

##### 项目介绍
###### 未选取视频页面展示
<p align="left"><img style="border-radius:5px;" src="https://huazizhanye.oss-cn-beijing.aliyuncs.com/blogs/images/videoToGif/nofinish.png"/></p>

###### 转换后页面展示
<p align="left"><img style="border-radius:5px;" src="https://huazizhanye.oss-cn-beijing.aliyuncs.com/blogs/images/videoToGif/finish.png"/></p>

###### 主逻辑部分
一进页面，开一个定时器，由页面控制选取帧的速度来控制流畅度，创建一个由用户决定分辨率的`canvas`的画布分离出每一帧后，再进行合并，并且将合并到一起的每一帧展示到页面上
```JavaScript
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
        if (imglist.length > video_timer) {
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
```

###### 选取视频逻辑
选取本地视频并创建播放器
```JavaScript
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
```

###### 进度条处理逻辑
```JavaScript
function ranges() {
	let inner = document.querySelector('.range_inner')
	let _range = document.querySelector('#range')
	let _video = document.querySelector('.video')
	inner.innerHTML = _range.value + 's'
	_video.currentTime = _range.value
}
```

###### 动画持续帧逻辑
```JavaScript
function timer() {
	let inner = document.querySelector('.timer_inner')
	let _timer = document.querySelector('#timer')
	inner.innerHTML = _timer.value + '帧'
	video_timer = _timer.value
}
```

###### 分辨率大小逻辑
```JavaScript
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
```

###### 动画速度逻辑
```JavaScript
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
```

###### 画质逻辑
```JavaScript
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
```

###### 流畅度逻辑
```JavaScript
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
```

###### 字节转换逻辑
```JavaScript
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
```

##### 查看文档地址
* [see github](http://blog.hzzy.xyz/pages/0778e2/) 