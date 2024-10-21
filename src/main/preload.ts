import { contextBridge, ipcRenderer } from "electron"
import type { Names, Channel } from "./lib/IpcMainHandle"
import type { Names as OnNames } from './lib/IpcMainOn'

const preloadList = {
  invoke: (channel: Names, ...args: any) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  on: (channel: Channel, func: any) => {
    ipcRenderer.addListener(channel, (...args) => func(...args))
  },
  removeListener: (channel: Channel, func: any) => {
    ipcRenderer.removeListener(channel, func)
  },
  send: (channel: OnNames, ...args: any) => {
    return ipcRenderer.send(channel, ...args)
  },
}

export type PreloadType = typeof preloadList

contextBridge.exposeInMainWorld("electron", preloadList)
