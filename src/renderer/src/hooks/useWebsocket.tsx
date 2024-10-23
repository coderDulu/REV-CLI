import { useState, useEffect, useRef, useCallback } from "react"

function useWebSocket() {
  const [message, setMessage] = useState<any>("")
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED)
  const websocketRef = useRef<WebSocket | null>(null)

  const connect = useCallback(
    (url: string) => {
      return new Promise<WebSocket>((resolve, reject) => {
        // 如果已经存在 WebSocket 连接，直接返回
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          return resolve(websocketRef.current)
        }

        // 关闭旧连接，准备创建新连接
        if (websocketRef.current) {
          websocketRef.current.close()
        }

        const ws = new WebSocket(url)
        websocketRef.current = ws
        setReadyState(WebSocket.CONNECTING)

        ws.onopen = () => {
          setReadyState(WebSocket.OPEN)
          resolve(ws)
        }

        ws.onmessage = (event) => {
          setMessage(() => event.data)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error: ", error)
        }

        ws.onclose = (event) => {
          setReadyState(WebSocket.CLOSED)
          setMessage("")
          reject(event)
        }
      })
    },
    [] // 依赖数组为空，确保 useCallback 不会在每次渲染时重新创建
  )

  useEffect(() => {
    // 组件卸载时，关闭 WebSocket 连接
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
    }
  }, [])

  const close = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close()
      setMessage("")
    }
  }, [])

  const sendMessage = useCallback((msg: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    return new Promise((resolve, reject) => {
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(msg)
        resolve(true)
      } else {
        reject(new Error("WebSocket is not open"))
      }
    })
  }, [])

  return {
    message,
    sendMessage,
    connect,
    readyState,
    close,
    addEventListener: websocketRef.current?.addEventListener,
  }
}

export default useWebSocket
