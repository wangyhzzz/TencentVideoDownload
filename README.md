## 使用方法
将腾讯视频vid信息传入获得m3u8文件列表

以下演示使用`ts-node`运行本程序：

`ts-node src/app.ts e0024f5mhf8`

默认高清，标清添加参数0(目前仅支持标清与高清,两种格式)

`ts-node src/app.ts e0024f5mhf8 0`

想转成mp4的话，可以将m3u8列表地址传入ffmpeg(需要额外安装)，例如：

`ffmpeg -i http://xxx.x.m3u8 -c copy -bsf:a aac_adtstoasc output.mp4`



## vid获取
 vid获取可以通过视频链接 (地址后面的`i0024rxw2f4`就是vid)

https://v.qq.com/x/cover/jvhuaf93hh858fs/i0024rxw2f4.html



## 仅供学习交流使用，请勿使用于其他用途

