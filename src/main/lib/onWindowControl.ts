import { BrowserWindow, Menu } from 'electron'

type ControlType = 'minimize' | 'toggle_maximize' | 'close'

/**
 * 窗口大小控制
 * @param e
 * @param action
 */
const onWindowControl = (e: Electron.IpcMainEvent, action: ControlType) => {
  const window = BrowserWindow.fromWebContents(e.sender)
  console.log('action => ', action)

  if (window) {
    if (action === 'toggle_maximize') {
      window.isMaximized() ? window.unmaximize() : window.maximize()
      return
    }

    window[action]()
  }
}

const isWindowMaximized = (e: Electron.IpcMainEvent) => {
  const window = BrowserWindow.fromWebContents(e.sender)
  if (window) {
    return window.isMaximized()
  }
  return false
}

type ShortKey = 'f5' | 'f12'
/**
 * 注册快捷键
 * @param e
 * @param action
 */
const onShortcutKey = (e: Electron.IpcMainEvent, action: ShortKey) => {
  const window = BrowserWindow.fromWebContents(e.sender)

  switch (action) {
    case 'f12':
      window?.webContents.toggleDevTools()
      break
    case 'f5':
      window?.webContents.reload()
      break
  }
}

export default {
  'window-control': onWindowControl,
  'shortcut-key': onShortcutKey,
  'is-window-maximized': isWindowMaximized
}
