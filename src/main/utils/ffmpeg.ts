import path from "path";
import { app } from "electron";
// const isDevelopment = require('electron-is-dev');
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");

const isDevelopment = !app.isPackaged;

if (isDevelopment) {
  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);
} else {
  ffmpeg.setFfmpegPath(ffmpegPath.replace("app.asar", "app.asar.unpacked"));
  ffmpeg.setFfprobePath(ffprobePath.replace("app.asar", "app.asar.unpacked"));
}

export function transVideo(url: any, outputOptions: string[] = [], onChunkChange?: (chunk: Buffer) => void) {
  return new Promise<null | Uint8Array>((resolve) => {
    try {
      const stream = ffmpeg(url)
        .on("start", (commandLine: any) => {
          // commandLine 是完整的ffmpeg命令
          console.log(commandLine, "转码 开始");
        })
        .on("codecData", function (data: any) {
          console.log(data, "转码中......");
        })
        .on("progress", function (progress: number) {
          console.log(progress, "转码进度");
        })
        .on("error", function (err: any, a: any, b: any) {
          console.log("转码 错误: ", err.message);
          console.log("输入错误", a);
          console.log("输出错误", b);
          resolve(null);
        })
        .on("end", function () {
          console.log("转码 结束!");
          const buffer = new Uint8Array(data);
          resolve(buffer);
        })
        .addOutputOption(
          "-threads",
          "4", // 一些降低延迟的配置参数
          "-tune",
          "zerolatency",
          "-preset",
          "ultrafast"
        )
        // .videoBitrate('200k')  // 设置码率
        // .inputOptions(['-b:v 200k'])
        // .outputOptions()
        .outputOptions([
          "-f flv", // 格式化
          "-c:v libx264", // 转码器
          ...outputOptions,
        ])
        // .toFormat("webm")
        // .videoCodec('libvpx-vp9') // ffmpeg无法直接将h265转换为flv的，故需要先将h265转换为h264，然后再转换为flv
        // .withSize('50%') // 转换之后的视频分辨率原来的50%, 如果转换出来的视频仍然延迟高，可按照文档上面的描述，自行降低分辨率
        // .noAudio() // 去除声音
        .pipe();

      const data: number[] = [];
      stream.on("data", (chunk: any) => {
        data.push(...chunk);
        onChunkChange && onChunkChange(chunk);
      });
    } catch (error) {}
  });
}
