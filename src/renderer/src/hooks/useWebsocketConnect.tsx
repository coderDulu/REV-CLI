import { useCallback, useState } from "react"
import useWebSocket from "./useWebsocket"
import useConnect from "./useConnect"
import { useActivate, useUnactivate } from "react-activation"

export type Callback = (event: any) => void

function useWebsocketConnect(path: string) {
  const { address, port, isConnect } = useConnect()
  const { connect, close, ...args } = useWebSocket()
  const wsUrl = `ws://${address}:${port}/${path}`
  const [isActive, setIsActive] = useState(false)

  const connectToWebsocket = useCallback(async () => {
    try {
      if (isConnect) {
        if(isActive) {
          const ws = await connect(wsUrl)
          return ws
        } 
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
  }, [connect, isConnect, close, wsUrl, isActive])

  useActivate(() => {
    setIsActive(true)
  })

  useUnactivate(() => {
    setIsActive(false)
  })

  return { ...args, close, connectToWebsocket }
}

export default useWebsocketConnect
