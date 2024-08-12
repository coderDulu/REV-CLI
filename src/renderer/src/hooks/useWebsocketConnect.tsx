import { useCallback, useEffect, useRef } from "react";
import useWebSocket from "./useWebsocket";
import useConnect from "./useConnect";
import useWebWorker from "./useWebWorkder";

export type Callback = (event: any) => void;

function useWebsocketConnect(path: string) {
  const { address, port, isConnect } = useConnect();
  const { connect, ...args } = useWebSocket();
  const wsUrl = `ws://${address}:${port}/${path}`;

  const connectToWebsocket = useCallback(async () => {
    try {
      if (isConnect) {
        const ws = await connect(wsUrl);
        return ws
      }
      return null
    } catch (error) {
      return null
    }
  }, [connect, isConnect, wsUrl]);

  return { ...args, connectToWebsocket };
}

export default useWebsocketConnect;
