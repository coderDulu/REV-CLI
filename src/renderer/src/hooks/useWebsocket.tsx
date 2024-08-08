import { useState, useEffect, useRef, useCallback } from 'react';

function useWebSocket() {
  const [message, setMessage] = useState(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const websocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback((url: string, callback?: (err: Event | null, socket: WebSocket | null) => void) => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket(url);
    websocketRef.current = ws;
    setReadyState(WebSocket.CONNECTING);

    ws.onopen = () => {
      setReadyState(WebSocket.OPEN);
      callback && callback(null, ws)
    };

    ws.onmessage = (event) => {
      setMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error: ', error);
      // callback && callback(error, null)
    };

    ws.onclose = (event) => {
      setReadyState(WebSocket.CLOSED);
      callback && callback(event, null)
    };
  }, []);

  useEffect(() => {
    // Return a cleanup function to close the WebSocket when the component unmounts
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const close = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  }, [])

  const sendMessage = useCallback((msg: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(msg);
    }
  }, []);

  return { message, sendMessage, connect, readyState, close };
}

export default useWebSocket;
