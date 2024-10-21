import { ipcMain, BrowserWindow } from "electron"
import { mainWindow } from "../index"
export type Names = "toggle-dev-tools"
type IpcMainHandle = {
  name: Names
  callback: <T = any>(event: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<T> | any
}

const EVENT_POOL: IpcMainHandle[] = [
  {
    name: "toggle-dev-tools",
    callback: (event) => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools() // 打开/关闭开发者工具
      }
      event.sender.send("dev-tools-status", mainWindow?.webContents.isDevToolsOpened())
    },
  },
]

;(() => {
  EVENT_POOL.forEach(({ name, callback }) => {
    ipcMain.on(name, callback)
  })
})()
