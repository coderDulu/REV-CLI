import { useState, useEffect, useRef, useCallback } from "react"

function useWebSocket(reconnectInterval = 2000, maxRetries = 5) {
  const [message, setMessage] = useState<any>("")
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED)
  const websocketRef = useRef<WebSocket | null>(null)
  const retryCountRef = useRef(0) // Track retries for reconnection

  const handleMessage = useCallback((event: MessageEvent) => {
    setMessage(event.data)
  }, [])

  const connect = useCallback(
    (url: string) => {
      return new Promise<WebSocket>((resolve, reject) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          return resolve(websocketRef.current)
        }

        if (websocketRef.current) {
          websocketRef.current.close()
          websocketRef.current.removeEventListener("message", handleMessage)
        }

        const ws = new WebSocket(url)
        websocketRef.current = ws
        setReadyState(WebSocket.CONNECTING)

        ws.addEventListener("message", handleMessage)

        ws.onopen = () => {
          setReadyState(WebSocket.OPEN)
          retryCountRef.current = 0 // Reset retry count on successful connection
          resolve(ws)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error: ", error)
          reject(error)
        }

        ws.onclose = (event) => {
          setReadyState(WebSocket.CLOSED)
          setMessage("")
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current += 1
            setTimeout(() => {
              console.log("reconnecting...")
              connect(url) // Attempt reconnection
            }, reconnectInterval)
          } else {
            reject(event)
          }
        }
      })
    },
    [handleMessage, maxRetries, reconnectInterval]
  )

  useEffect(() => {
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
      retryCountRef.current = 0 // Reset retry count if closed manually
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
    websocketRef,
  }
}

export default useWebSocket
