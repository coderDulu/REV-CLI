// 监听主进程事件
import { useEffect } from "react"


export function useListenWsClosed(subscribe: (e: Electron.IpcRendererEvent, isClosed: boolean) => void) {
  useEffect(() => {
    console.log('23333');
    window.electron.on('ws-closed', subscribe)
    return () => {
      window.electron.removeListener('ws-closed', subscribe)
    }
  }, [subscribe])
}