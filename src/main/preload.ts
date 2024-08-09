import { contextBridge, ipcRenderer } from "electron";
import type { Names, Channel } from './lib/IpcMainHandle'

const preloadList = {
  invoke: (channel: Names, ...args: any) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel: Channel, func: any) => {
    ipcRenderer.addListener(channel, (...args) => func(...args));
  },
  removeListener: (channel: Channel, func: any) => {
    ipcRenderer.removeListener(channel, func);
  }

};

export type PreloadType = typeof preloadList;

contextBridge.exposeInMainWorld("electron", preloadList);
