import { useState, useEffect, useRef, useCallback } from "react";

function useWebSocket() {
  const [message, setMessage] = useState<any>("");
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED);
  const websocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(
    (url: string) => {
      return new Promise<WebSocket>((resolve, reject) => {
        if (websocketRef.current) {
          websocketRef.current.close();
        }

        const ws = new WebSocket(url);
        websocketRef.current = ws;
        setReadyState(WebSocket.CONNECTING);

        ws.onopen = () => {
          setReadyState(WebSocket.OPEN);
          resolve(ws);
        };

        ws.onmessage = (event) => {
          console.log("Received message:", event.data);
          setMessage(() => event.data);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error: ", error);
          // callback && callback(error, null)
        };

        ws.onclose = (event) => {
          setReadyState(WebSocket.CLOSED);
          setMessage("");
          reject(event);
        };
      });
    },
    [setMessage]
  );

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
      setMessage("");
    }
  }, [setMessage]);

  const sendMessage = useCallback((msg: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    return new Promise((resolve, reject) => {
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(msg);
        resolve(true);
      } else {
        reject(new Error("send failed"));
      }
    });
  }, []);

  return { message, sendMessage, connect, readyState, close, websocketRef };
}

export default useWebSocket;
