import { useState, useEffect, useRef, useCallback } from "react"

function useWebSocket(reconnectInterval = 2000, maxRetries = 5) {
  const [message, setMessage] = useState<any>("")
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED)
  const websocketRef = useRef<WebSocket | null>(null)
  const retryCountRef = useRef(0)
  const urlRef = useRef<string | null>(null)
  const reconnect = useRef(false)

  useEffect(() => {
    reconnect.current = true
    return () => {
      reconnect.current = false
    }
  }, [])

  const handleMessage = useCallback((event: MessageEvent) => {
    setMessage(event.data)

    const eventName = urlRef.current?.split("/")?.pop()
    if (eventName) {
      const wsEvent = new CustomEvent(`ws-${eventName}`, { detail: event.data })
      window.dispatchEvent(wsEvent)
    }
  }, [])

  const connect = useCallback(
    (url: string) => {
      if (!reconnect.current) {
        return
      }

      if (
        websocketRef.current &&
        websocketRef.current.readyState !== WebSocket.CLOSED &&
        urlRef.current === url
      ) {
        return Promise.resolve(websocketRef.current)
      }

      return new Promise<WebSocket>((resolve, reject) => {
        if (websocketRef.current) {
          websocketRef.current.close()
          websocketRef.current.removeEventListener("message", handleMessage)
        }

        const ws = new WebSocket(url)
        websocketRef.current = ws
        urlRef.current = url
        setReadyState(WebSocket.CONNECTING)

        ws.addEventListener("message", handleMessage)

        ws.onopen = () => {
          setReadyState(WebSocket.OPEN)
          retryCountRef.current = 0
          resolve(ws)
        }

        ws.onerror = (error) => {
          console.error("WebSocket error: ", error)
          reject(error)
        }

        ws.onclose = (event) => {
          websocketRef.current = null
          setReadyState(WebSocket.CLOSED)
          setMessage("")
          if (retryCountRef.current < maxRetries) {
            retryCountRef.current += 1
            setTimeout(() => connect(url), reconnectInterval)
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
      retryCountRef.current = 0
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
