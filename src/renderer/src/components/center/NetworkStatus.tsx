import { Flex } from "antd";
import NodeBar from "../NodeBar";
import Topology from "../Topology";
import { useImmer } from "use-immer";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { useEffect } from "react";

function NetworkStatus() {
  const [data, setData] = useImmer([])
  const { connectToWebsocket } = useWebsocketConnect("network-bar")

  useEffect(() => {
    connectToWebsocket().then(res => {
      res?.addEventListener("message", (ev) => {
        setData(ev.data)
      })
    })
  }, [connectToWebsocket]);

  return (
    <Flex vertical className="w-full h-full pt-5 pr-5">
      <div className="flex-1 min-h-0">
        <Topology exclude={[0]}  />
      </div>
      <div className="flex-1 min-h-0">
        <NodeBar data={data} xLength={1024}/>
      </div>
    </Flex>
  );
}

export default NetworkStatus;
