// 信道使用分布
import useECharts from "@/hooks/useEcharts";
import { useEffect } from "react";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";

const colors = ["#fbfbfb", "#efbe8d", "#71b4b9"];
// prettier-ignore
const xAxisData = Array(8).fill(0).map((i, index) => index);
// prettier-ignore
const yAxisData = Array(4).fill(0).map((i, index) => index);
// prettier-ignore
const data: number[][] = []
xAxisData.forEach((item) => {
  yAxisData.forEach((item2) => {
    data.push([item, item2, 1]);
  });
});

const initOption = {
  title: {
    text: `子网干扰业务分布`,
    top: "10px",
    left: "4%",
    textStyle: {
      fontSize: 24,
      color: "#000",
    },
  },
  tooltip: {
    position: "top",
    formatter: function (params) {
      switch (params.dataIndex) {
        case 0:
          return "未使用";
        case 1:
          return "已用未激活";
        case 2:
          return "已用已激活";
      }
    },
  },
  grid: {
    // height: "50%",
    top: "10%",
  },
  xAxis: {
    type: "category",
    data: xAxisData,
    splitArea: {
      show: true,
    },
    axisLabel: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  yAxis: {
    type: "category",
    data: yAxisData,
    splitArea: {
      show: true,
    },
    axisLabel: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  visualMap: {
    pieces: [
      { min: 1, max: 1, label: "未使用", color: colors[0] },
      { min: 2, max: 2, label: "已用未激活", color: colors[1] },
      { min: 3, max: 3, label: "已用已激活", color: colors[2] },
    ],
    min: 1,
    max: 3,
    type: "piecewise",
    calculable: true,
    orient: "horizontal",
    left: "center",
    bottom: "4%",
  },
  series: [
    {
      name: "子信道使用分布",
      type: "heatmap",
      data: data,
      label: {
        show: true,
        formatter: (params: any) => {
          // console.log('params', params.data);
          const x = params.data[0] as number;
          const y = params.data[1];
          const initNumber = yAxisData.length - 1;
          const number = (initNumber - y) * xAxisData.length + 1 + x;

          return number;
        },
        fontSize: 15,
        fontWeight: "bolder",
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

function ChannelUse({ chooseNode }: { chooseNode: string }) {
  const { domRef, update } = useECharts(initOption);
  const { connectToWebsocket, websocketRef } = useWebsocketConnect("business");

  useEffect(() => {
    connectToWebsocket();
  }, []);

  useEffect(() => {
    console.log('data', data);
    function parseData(ev) {
      try {
        const data: any[] = JSON.parse(ev.data);
        console.log(data);
        data.map(item => {
          const type = item[0]
          const index = item[1]
          
        })
      } catch (error) {
        console.log('error', error);
      }
    }

    const ws = websocketRef.current;
    ws?.addEventListener("message", parseData);

    update({
      title: {
        text: `子网${chooseNode}干扰业务分布`,
      },
    });
    return () => {
      ws?.removeEventListener("message", parseData);
    };
  }, [chooseNode]);

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>;
}

export default ChannelUse;
