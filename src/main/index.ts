/**
 * main文件夹：
 *  service 自定义服务器模块
 *  client  tcp/udp客户端连接你姐姐
 *  menu => 菜单管理
 *  preload.js => 预加载文件，用于沟通渲染进程与主进程
 *  event   主进程和渲染进程通信模块
 */
import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";

import setupMenus from "./menu";
import "./menu/application";
import * as dotenv from "dotenv";
import "./lib/IpcMainHandle"

const envPath = path.resolve(__dirname, "../../.env.development");
dotenv.config({
  path: envPath,
});

// 定义变量
let mainWindow: BrowserWindow | null = null;
const isDev = !app.isPackaged; // 是否是development

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"; // 关闭警告

process.on("uncaughtException", (error) => {
  console.error(error);
});
// 新建窗口
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "./preload.cjs"),
      nodeIntegration: false, // 不允许在渲染进程中使用nodejs Api
      contextIsolation: true, // 开启上下文隔离，通过preload进行通信
    },
    show: false,
    frame: false,
    minWidth: 768,
    minHeight: 600,
  });
  console.log("isDev", isDev);
  if (isDev) {
    const PORT = process.env.VITE_PORT || 5173;
    const URL = `http://localhost:${PORT}`;
    console.log(`electron on ${URL}`);
    mainWindow.loadURL(URL);
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    const staticPath = path.join(__dirname, "../renderer/index.html");
    console.log("staticPath", staticPath);
    mainWindow.loadFile(staticPath);
    // 打开开发者工具
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on("ready-to-show", () => {
    // 显示窗口
    mainWindow?.show();
  });

  // 关闭window时触发
  mainWindow.on("closed", function () {
    mainWindow?.destroy();
    mainWindow = null;
  });
}

// 当electron完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 创建窗口
  createWindow();

  // 添加右键菜单
  if (mainWindow) {
    setupMenus.setupContextMenu(mainWindow);
    setupMenus.addRegisterKey(mainWindow);

  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭时退出应用
app.on("window-all-closed", function () {
  // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
  if (process.platform !== "darwin") {
    app.quit();
  }
});



export default mainWindow;

// app.disableHardwareAcceleration() // 禁用硬件加速
// app.commandLine.appendSwitch('ignore-gpu-blacklist') // 忽略 GPU 黑名单
