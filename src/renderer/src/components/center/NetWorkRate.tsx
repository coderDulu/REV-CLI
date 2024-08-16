import useECharts from "@/hooks/useEcharts";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { useEffect } from "react";

// 频谱管控状态
export default function SpectrumStatus() {
  const { connectToWebsocket } = useWebsocketConnect("net-rate");
  const { domRef, update } = useECharts({
    grid: {
      bottom: "8%",
      left: "5%",
      height: "70%",
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        axis: "x",
      },
    },
    toolbox: {
      show: true,
    },
    xAxis: {
      name: "时间",
      type: "time",
    },
    legend: {},
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        data: [],
        smooth: false,
        showSymbol: false,
        sampling: "lttb",
        large: true,
        largeThreshold: 1000,
        itemStyle: {
          color: "#0d8383"
        }
      },
    ],
    animation: false,
    title: {
      text: "实时网络传输速率",
      top: 10,
      left: 20,
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
    },
  });

  useEffect(() => {
    connectToWebsocket().then((socket) => {
      const lastData: number[][] = [];
      socket?.addEventListener("message", (ev) => {
        try {
          const { rate } = JSON.parse(ev.data);
          lastData.push([Date.now(), rate]);

          if (lastData.length > 60) {
            lastData.shift();
          }
          const option = {
            series: [
              {
                data: lastData,
              },
            ],
          };
          update(option);
        } catch (error) {
          console.log("SpectrumStatus", error);
        }
      });
    });
  }, [connectToWebsocket]);

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>;
}
