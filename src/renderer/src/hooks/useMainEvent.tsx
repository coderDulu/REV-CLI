// 监听主进程事件
import { useEffect } from "react"
import { getTypeOfPreload } from '../../../preload'

export function useListenMainEvent(event: getTypeOfPreload<'on'>, subscribe: (e: Electron.IpcRendererEvent, ...args: never[]) => void) {
  useEffect(() => {
    window.electron.on(event, subscribe)
    return () => {
      window.electron.removeListener(event, subscribe)
    }
  }, [subscribe, event])
}