import { useHeatmap } from "@/hooks/useHeatmap";
import { Flex } from "antd";
import { useEffect } from "react";
import useWebSocketConnect from "@/hooks/useWebsocketConnect";

function Spectrum() {
  const { update: update1, heatmapEcharts } = useHeatmap(1);
  const { update: update2, heatmapEcharts: heatmapEcharts2 } = useHeatmap(2);
  const { connectToWebsocket, close } = useWebSocketConnect("freq-status");

  useEffect(() => {
    connectToWebsocket().then((ws) => {
      ws?.addEventListener("message", (ev) => {
        try {
          const parseData: any[] = JSON.parse(ev.data);
          parseData.forEach((element: any) => {
            const { freq_status, start_freq, field_num } = element;
            if (field_num === 1) {
              update1(freq_status, start_freq);
            } else if(field_num === 2) {
              update2(freq_status, start_freq);
            }
          });
        } catch (error) {
          console.log(error);
        }
      });
    });
    return () => {
      close();
    };
  }, []);

  return (
    <Flex vertical gap={10} className="w-full h-full">
      <div className="flex-1" ref={(dom) => (heatmapEcharts.domRef.current = dom)}></div>
      <div className="flex-1" ref={(dom) => (heatmapEcharts2.domRef.current = dom)}></div>
    </Flex>
  );
}

export default Spectrum;
