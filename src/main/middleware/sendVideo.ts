import { transVideoToStream } from "../utils/ffmpeg";
import WebSocket from "ws";

const webSocketStream = require("websocket-stream/stream");
let videoTxLocalProcess: any = null;

export function startSendVideo(e: Electron.IpcMainInvokeEvent, path: string, deviceInfo: any) {
  try {
    console.log(deviceInfo);
    if (deviceInfo.address && deviceInfo.port) {
      console.log("2333");
      const ws = new WebSocket(`ws://${deviceInfo.address}:${deviceInfo.port}/video`);
      ws.onopen = () => {
        console.log("ws", "open");
      };
      const stream = webSocketStream(ws, {
        binary: true,
      });
      videoTxLocalProcess = transVideoToStream(path, stream);
    }

    // return Promise.reject("ws-connect close");

    // videoWs
  } catch (error) {
    console.log("startSendVideo error", error);
  }
}

export function stopSendVideo(e: Electron.IpcMainInvokeEvent) {
  try {
    videoTxLocalProcess?.destroy();
    e.sender.send("video-stopped")
  } catch (error) {
    console.log("stopSendVideo error", error);
  }
}
