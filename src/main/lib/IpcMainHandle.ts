import { ipcMain, BrowserWindow } from "electron";
import windowControl from "../utils/windowControl";

export type Names = "window-control" | "window-status";
export type events = ""

type IpcMainHandle<T = any> = {
  name: Names;
  callback: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<T> | any;
};

const EVENT_POOL: IpcMainHandle[] = [
  { // 窗口控制
    name: "window-control",
    callback: (event, type) => {
      console.log("window-control", type);
      // 获取当前窗口的引用
      windowControl(type);
    },
  },
  { // 获取窗口状态
    name: "window-status",
    callback: () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win) {
        return win.isMaximized();
      }
      return false;
    },
  },
];

(() => {
  EVENT_POOL.forEach(({ name, callback }) => {
    ipcMain.handle(name, callback);
  });
})();
