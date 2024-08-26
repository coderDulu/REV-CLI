import { useEffect, useState } from "react";
import ChannelUse from "../ChannelUse";
import NodeBar from "../NodeBar";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import useConnect from "@/hooks/useConnect";
function NodeStatus() {
  const { address } = useConnect();
  const { connectToWebsocket, websocketRef } = useWebsocketConnect(`user?ip=${address}`);
  const [chooseNode, setChooseData] = useState("");

  useEffect(() => {
    connectToWebsocket();
  }, [connectToWebsocket]);

  useEffect(() => {
    const ws = websocketRef.current;
    const parseData = (ev) => {
      try {
        const parseData = JSON.parse(ev.data);
        setChooseData(parseData.data);
      } catch (error) {
        console.log(";error", error);
      }
    };
    ws?.addEventListener("message", parseData);

    return () => {
      ws?.removeEventListener("message", parseData);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full h-1/2">
        <ChannelUse chooseNode={chooseNode} />
      </div>
      <div className="w-full h-1/2">
        <NodeBar node={chooseNode} />
      </div>
    </div>
  );
}

export default NodeStatus;
