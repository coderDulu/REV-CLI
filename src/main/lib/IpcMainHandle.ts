import { ipcMain, BrowserWindow } from "electron";
import windowControl from "../utils/windowControl";
import WebSocketClient from "../utils/ws";

export type Names = "window-control" | "window-status" | "ws-connect" | "ws-disconnect";
export type Channel = "ws-closed";

type IpcMainHandle = {
  name: Names;
  callback: <T = any>(event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<T> | any;
};

let ws: WebSocketClient | null = null;

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
];

(() => {
  EVENT_POOL.forEach(({ name, callback }) => {
    ipcMain.handle(name, callback);
  });
})();
