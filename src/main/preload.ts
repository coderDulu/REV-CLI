import { contextBridge, ipcRenderer } from "electron";
import type { Names } from './lib/IpcMainHandle'

const preloadList = {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: any) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  invoke: (channel: Names, data: any) => {
    return ipcRenderer.invoke(channel, data);
  },
};

export type PreloadType = typeof preloadList;

contextBridge.exposeInMainWorld("electron", preloadList);
