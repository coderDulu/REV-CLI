import { useCallback, useEffect } from "react"
import useWebSocket from "./useWebsocket"
import useConnect from "./useConnect"

export type Callback = (event: any) => void

function useWebsocketConnect(path: string, onMessage?: (data: string) => void) {
  const { address, port, isConnect } = useConnect()
  const { connect, close, readyState, websocketRef, ...args } = useWebSocket()
  const wsUrl = `ws://${address}:${port}/${path}`

  const connectToWebsocket = useCallback(async () => {
    try {
      if (isConnect) {
        const ws = await connect(wsUrl)
        return ws
      } else {
        close()
      }
      return null
    } catch (error) {
      console.error("Error connecting to websocket:", error)
      return null
    }
  }, [isConnect, connect, wsUrl, close])

  useEffect(() => {
    const handleMessage = (ev) => {
      onMessage && onMessage(ev.data)
    }
    const ws = websocketRef.current
    if (readyState === WebSocket.OPEN) {
      ws?.addEventListener("message", handleMessage)
    }

    return () => {
      ws?.removeEventListener("message", handleMessage)
    }
  }, [onMessage, readyState, websocketRef])

  return { ...args, close, connectToWebsocket }
}

export default useWebsocketConnect
