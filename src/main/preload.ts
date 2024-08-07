import { contextBridge, ipcRenderer } from "electron";
import type { Names, events } from './lib/IpcMainHandle'

const preloadList = {
  invoke: (channel: Names, ...args: any) => {
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel: events, func: any) => {
    ipcRenderer.on(channel, (...args) => func(...args));
  },
};

export type PreloadType = typeof preloadList;

contextBridge.exposeInMainWorld("electron", preloadList);
