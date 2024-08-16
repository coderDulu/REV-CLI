import useECharts from "@/hooks/useEcharts";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { useEffect } from "react";

// 频谱管控状态
export default function SpectrumStatus() {
  const { connectToWebsocket } = useWebsocketConnect("spectrum-status");
  const { domRef, update } = useECharts({
    title: {
      text: `频谱管控状态`,
      top: 20,
      left: 20,
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
    },
    tooltip: {
      formatter: (params: any) => {
        if (params.seriesName == "受控") {
          return "受控频段";
        } else {
          return "未受控频段";
        }
      },
    },
    legend: {
      selectedMode: true,
      top: "20%",
    },
    grid: {
      height: "50%",
      top: "50%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      min: 225,
      max: 678,
    },
    yAxis: {
      type: "category",
      data: ["频谱"],
      show: false,
    },
    series: [
      {
        name: "未受控",
        id: "1",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [300],
        itemStyle: {
          color: "#81dae0", // Change this to your desired color
        },
      },
      {
        name: "受控",
        id: "2",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: "受控区间",
        },
        emphasis: {
          focus: "series",
        },
        data: [160],
        itemStyle: {
          color: "#efbe8d", // Change this to your desired color
        },
      },
      {
        name: "未受控",
        id: "3",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [678],
        itemStyle: {
          color: "#81dae0", // Change this to your desired color
        },
      },
    ],
  });

  useEffect(() => {
    connectToWebsocket().then((socket) => {
      let lastData = {};
      socket?.addEventListener("message", (ev) => {
        try {
          const { startFreq, endFreq } = JSON.parse(ev.data);
          // const startData1 = parseInt(startFreq) - 10
          // const endData1 = startData1 + 160
          const option = {
            series: [
              {
                id: "1",
                data: [startFreq],
              },
              {
                id: "2",
                label: {
                  show: true,
                  formatter: startFreq + "MHz-" + endFreq + "MHz",
                  fontSize: 15,
                  fontWeight: "bolder",
                },
              },
            ],
          };
          update(option, lastData);
          lastData = option;
        } catch (error) {
          console.log("SpectrumStatus", error);
        }
      });
    });
  }, [connectToWebsocket]);

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>;
}
