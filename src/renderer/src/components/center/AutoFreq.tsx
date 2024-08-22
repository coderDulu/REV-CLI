// 自主选频
import { useEffect, useState } from "react";
import Topology from "../Topology";
import { useHeatmap } from "@/hooks/useHeatmap";
import useWebSocketConnect from "@/hooks/useWebsocketConnect";
import ChannelUse from "../ChannelUse";

function AutoFreq() {
  const [chooseNode, setChooseNode] = useState("");
  const { heatmapEcharts, update } = useHeatmap(chooseNode);
  const { connectToWebsocket, close, websocketRef } = useWebSocketConnect("freq-status");

  useEffect(() => {
    connectToWebsocket();
    return () => {
      close();
    };
  }, [close, connectToWebsocket]);

  useEffect(() => {
    const cache = [];

    heatmapEcharts.myChart.current?.setOption({
      series: [{ data: [] }],
    });

    function parseData(ev) {
      try {
        const parseData: any[] = JSON.parse(ev.data);
        parseData.forEach((element: any) => {
          const { freq_status, start_freq, field_num } = element;

          if (Number(chooseNode) === field_num) {
            update(freq_status, start_freq, cache, chooseNode);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    const ws = websocketRef.current;

    ws?.addEventListener("message", parseData);

    return () => {
      ws?.removeEventListener("message", parseData);
    };
  }, [chooseNode]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1">
          <Topology tips="点击用户端节点显示不同内容" onNodeClick={(c) => setChooseNode(c)} exclude={[0]} />
        </div>
        <div className="flex-1" ref={(dom) => (heatmapEcharts.domRef.current = dom)}></div>
      </div>
      <div className="flex-1">
        <ChannelUse chooseNode={chooseNode}/>
      </div>
    </div>
  );
}

export default AutoFreq;
