import { useCallback } from "react";
import useWebSocket from "./useWebsocket";
import useConnect from "./useConnect";

export type Callback = (event: any) => void;

function useWebsocketConnect(path: string) {
  const { address, port, isConnect } = useConnect();
  const { connect, close,...args } = useWebSocket();
  const wsUrl = `ws://${address}:${port}/${path}`;

  const connectToWebsocket = useCallback(async () => {
    try {
      if (isConnect) {
        const ws = await connect(wsUrl);
        return ws;
      } else {
        close();
      }
      return null;
    } catch (error) {
      console.error('Error connecting to websocket:', error);
      return null;
    }
  }, [connect, isConnect, close, wsUrl]);

  return { ...args, close,connectToWebsocket };
}

export default useWebsocketConnect;
