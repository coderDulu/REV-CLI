import { Menu } from "electron";

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: "连接",
    click: (_, browserWindow) => {
      browserWindow?.webContents.send("show:dialog", "connect");
    },
  },
  {
    label: "关于",
    click: (_, browserWindow) => {
      browserWindow?.webContents.send("show:dialog", "about");
    },
  },
];

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
