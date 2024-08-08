import { useEffect, useRef, useState, useCallback } from "react";

const useWebsocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [receiveMessage, setReceiveMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messageQueue = useRef<string[]>([]);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      socketRef.current = socket;

      // Send queued messages
      while (messageQueue.current.length > 0) {
        const message = messageQueue.current.shift();
        if (message) {
          socket.send(message);
        }
      }
    };

    socket.onmessage = (event) => {
      setReceiveMessage(event.data);
    };

    socket.onclose = () => {
      setIsConnected(false);
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return socket;
  }, [url]);


  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = useCallback((msg: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(msg);
    } else {
      messageQueue.current.push(msg);
    }
  }, [isConnected]);

  const close = useCallback(() => {
    console.log(socketRef.current, "close");

    socketRef.current?.close();
  }, []);

  return {
    sendMessage,
    close,
    receiveMessage,
    isConnected,
    connect
  };
};

export default useWebsocket;
