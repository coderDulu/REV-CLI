import { ipcMain, BrowserWindow } from "electron";
import windowControl from "../utils/windowControl";
import WebSocketClient from "../utils/ws";
import { transVideo } from "../utils/ffmpeg";

export type Names = "window-control" | "window-status" | "ws-connect" | "ws-disconnect" | "send-video";
export type Channel = "ws-closed";

type IpcMainHandle = {
  name: Names;
  callback: <T = any>(event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<T> | any;
};

let ws: WebSocketClient | null = null;
let deviceInfo = {
  address: "",
  port: 0,
};

function sendToRenderer(e: Electron.IpcMainInvokeEvent, channel: Channel, ...args: any) {
  if (e.sender) {
    e.sender.send(channel, ...args);
  }
}

const EVENT_POOL: IpcMainHandle[] = [
  {
    // 窗口控制
    name: "window-control",
    callback: (event, type) => {
      console.log("window-control", type);
      // 获取当前窗口的引用
      windowControl(type);
    },
  },
  {
    // 获取窗口状态
    name: "window-status",
    callback: () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) {
        return win.isMaximized();
      }
      return false;
    },
  },
  {
    name: "ws-connect",
    callback: (e, connectInfo) => {
      return new Promise<void>((resolve, reject) => {
        console.log("ws-connect", connectInfo);
        deviceInfo = connectInfo;
        ws = new WebSocketClient(`ws://${connectInfo.address}:${connectInfo.port}/connect`, {
          onOpen: () => {
            console.log("ws-connect open");
            resolve();
          },
          onClose: () => {
            console.log("ws-connect close");
            sendToRenderer(e, "ws-closed", true);

            reject("ws-connect close");
          },
        });
      });
    },
  },
  {
    name: "ws-disconnect",
    callback: () => {
      try {
        ws?.close();
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
  {
    name: "send-video",
    callback: async (e, path: string) => {
      try {
        if (deviceInfo.address && deviceInfo.port) {
          const videoWs = new WebSocketClient(`ws://${deviceInfo.address}:${deviceInfo.port}/video`);
          console.log("path", path);
          transVideo(path, [], (data) => {
            // console.log("chunk", data);
            videoWs.send(data);
          });
        }

        return Promise.reject("ws-connect close");

        // videoWs
      } catch (error) {}
    },
  },
];

(() => {
  EVENT_POOL.forEach(({ name, callback }) => {
    ipcMain.handle(name, callback);
  });
})();
