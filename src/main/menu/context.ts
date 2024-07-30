import { Menu, MenuItem, MenuItemConstructorOptions, BrowserWindow, globalShortcut } from 'electron'
/**
 * 创建菜单项
 * @param customItems 自定义菜单选项
 * @returns
 */
export function createContextMenu(customItems: MenuItemConstructorOptions[] = []) {
  const contextMenu = new Menu()

  // 添加自定义菜单项
  customItems.forEach((item) => {
    contextMenu.append(new MenuItem(item))
  })

  // 添加一些默认的菜单项（复制、剪切、粘贴等）
  contextMenu.append(new MenuItem({ label: '复制', role: 'copy', accelerator: 'Ctrl + C' }))
  contextMenu.append(new MenuItem({ label: '剪切', role: 'cut', accelerator: 'Ctrl + X' }))
  contextMenu.append(new MenuItem({ label: '粘贴', role: 'paste', accelerator: 'Ctrl + V' }))
  contextMenu.append(
    new MenuItem({
      label: '刷新',
      role: 'reload',
      accelerator: 'F5'
    })
  )

  return contextMenu
}

/**
 * 创建右键菜单
 * @param window BrowserWindow
 * @param customItems 自定义选项
 */
export function setupContextMenu(
  window: BrowserWindow | null,
  customItems: MenuItemConstructorOptions[] = []
) {
  const contextMenu = createContextMenu(customItems)

  window?.webContents.addListener('context-menu', (e, props) => {
    contextMenu.popup({
      window: window,
      x: props.x,
      y: props.y
    })
  })
}

/**
 * 添加全局快捷键
 * @param window BrowserWindow
 * @returns
 */
export function addRegisterKey(window: BrowserWindow) {
  // 注册全局快捷键以触发刷新

  if (!window) return

  // 页面刷新快捷键
  globalShortcut.register('F5', () => {
    window.webContents.reload()
  })

  // 开发者工具快捷键
  globalShortcut.register('F7', () => {
    window.webContents.toggleDevTools()
  })
}
