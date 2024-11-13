import { useCallback } from "react"
import useWebSocket from "./useWebsocket"
import useConnect from "./useConnect"

export type Callback = (event: any) => void

function useWebsocketConnect(path: string) {
  const { address, port, isConnect } = useConnect()
  const { connect, close, ...args } = useWebSocket()
  const wsUrl = `ws://${address}:${port}/${path}`

  const connectToWebsocket = useCallback(
    async (onMessage?: (data: string) => void) => {
      try {
        if (isConnect) {
          const ws = await connect(wsUrl, onMessage)
          return ws
        } else {
          close()
        }
        return null
      } catch (error) {
        console.error("Error connecting to websocket:", error)
        return null
      }
    },
    [isConnect, connect, wsUrl, close]
  )

  // const lastState = useRef(readyState)
  // useEffect(() => {
  //   console.log(lastState.current, readyState);
  //   if(lastState.current === WebSocket.OPEN && readyState === WebSocket.CLOSED) {
  //     window.$message.error("连接已断开，请刷新页面")
  //   }
  //   return () => {
  //     lastState.current = readyState
  //   }
  // }, [readyState])

  return { ...args, close, connectToWebsocket }
}

export default useWebsocketConnect
