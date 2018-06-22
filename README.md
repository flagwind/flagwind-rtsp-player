# RTSP Player

一个基于 [`Electron`](https://github.com/electron/electron/tree/1-4-x/docs) + [`VLC`](https://github.com/jaruba/wcjs-player/wiki/JavaScript-API) 的 RTSP 视频播放解决方案，可用于播放 `海康`、`大华` 等支持 RTSP 协议的网络摄像头。

## 安装调试

安装依赖：

``` bash
$ npm install
```

调试：

``` bash
$ npm run dev
```

## 打包部署

打包配置在 `build\dist.config.js` 文件中修改，对应的配置项请浏览
[electron-packager](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md) 文档。

打包命令如下：

``` bash
$ npm run dist
```

打包后的文件在 `dist\app` 目录中。

## RTSP 协议

以海康威视IP摄像头为例：

    rtsp://[username]:[passwd]@[ip]:[port]/[codec]/[channel]/[subtype]/av_stream

- username：用户名，例如admin
- passwd：密码，例如12345
- ip：设备的ip地址，例如192.0.0.64
- port：端口号默认554，若为默认可以不写
- codec：有h264、MPEG-4、mpeg4这几种
- channel：通道号，起始为1
- subtype：码流类型，主码流为main,子码流为sub

获取通道1的主码流，url如下：

    rtsp://admin:admin123@10.10.10.127:554/h264/ch1/main/av_stream
    rtsp://admin:admin123@10.10.10.127:554/mpeg4/ch1/main/av_stream