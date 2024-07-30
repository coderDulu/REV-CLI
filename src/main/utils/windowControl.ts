import { BrowserWindow } from "electron";

function windowControl(type: string) {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    switch (type) {
      case "minimize":
        win.minimize();
        break;
      case "maximize":
        win.maximize();
        break;
      case "restore":
        win.restore();
        break;
      case "close":
        win.close();
        break;
      default:
        console.log(`Unsupported window control type: ${type}`);
    }
  }
}

export default windowControl;
