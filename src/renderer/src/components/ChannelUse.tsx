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
const seriesData: number[][] = []
const dataMap = new Map();
xAxisData.forEach((item) => {
  yAxisData.forEach((item2) => {
    const saveItem = [item, item2, 1];
    seriesData.push(saveItem);

    const x = item;
    const y = item2;
    const initNumber = yAxisData.length - 1;
    const number = (initNumber - y) * xAxisData.length + 1 + x;
    dataMap.set([item, item2].join("-"), number);
    dataMap.set(number, saveItem);
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
      data: seriesData,
      label: {
        show: true,
        formatter: (params: any) => {
          const x = params.data[0];
          const y = params.data[1];
          const number = dataMap.get([x, y].join("-"));
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
  const { domRef, update, isSame, myChart } = useECharts(initOption);
  const { connectToWebsocket, websocketRef } = useWebsocketConnect("business");

  useEffect(() => {
    connectToWebsocket();
  }, [connectToWebsocket]);

  useEffect(() => {
    console.log("choose", chooseNode);
    let lastData: number[][] = [];
    update({
      series: [{ data: seriesData }],
    });
    
    function parseData(ev) {
      try {
        const parseData = JSON.parse(ev.data);

        const data: number[][] = parseData.data;
        const cacheData = JSON.parse(JSON.stringify(seriesData));

        data.map((item) => {
          const type = item[0];
          const index = item[1];
          const findValue = dataMap.get(index);
          if (findValue) {
            const updateIndex = cacheData.findIndex((item) => item[0] === findValue[0] && item[1] === findValue[1]);
            if (updateIndex !== -1) {
              cacheData[updateIndex][2] = type;
            }
          }
        });

        if (!isSame(data, lastData) && Number(chooseNode) === parseData.field_num) {
          update({ series: [{ data: cacheData }] });
          lastData = data;
        }
      } catch (error) {
        console.log("error", error);
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
