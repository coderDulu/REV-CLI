import { contextBridge, ipcRenderer } from "electron";

const preloadList = {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: any) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
};

export type PreloadType = typeof preloadList;

contextBridge.exposeInMainWorld("electron", preloadList);
