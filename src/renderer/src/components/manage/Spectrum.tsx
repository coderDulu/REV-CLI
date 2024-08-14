import { useHeatmap } from "@/hooks/useHeatmap";
import { Flex, Input } from "antd";
import { useEffect } from "react";
import useWebSocketConnect from "@/hooks/useWebsocketConnect";
import useEcharts from "@/hooks/useEcharts";

function generateFreqStatus() {
  const arr = [];
  for (var i = 0; i < 10; i++) {
    var randomNum = Math.floor(Math.random() * 10);
    if (randomNum < 2) {
      // 约20%的概率生成'-'
      arr.push("-");
    } else {
      // 约80%的概率生成1-8的随机数
      arr.push(Math.floor(Math.random() * 8) + 1);
    }
  }
  return arr;
}

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
            } else {
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
      <div className="flex-1" ref={heatmapEcharts.domRef}></div>
      <div className="flex-1" ref={heatmapEcharts2.domRef}>2</div>
    </Flex>
  );
}

export default Spectrum;
