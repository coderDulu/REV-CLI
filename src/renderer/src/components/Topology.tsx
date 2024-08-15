import useECharts from "@/hooks/useEcharts";
import { useCallback, useEffect } from "react";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { Alert } from "antd";

interface Props {
  tips?: string;
  exclude?: number[];
  onNodeClick?: (chooseNode: string) => void;
}
function Topology({ onNodeClick, tips, exclude }: Props) {
  const { connectToWebsocket } = useWebsocketConnect("topology");
  const { domRef, update, myChart } = useECharts({
    title: {
      text: "网络拓扑",
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
      top: 40,
      left: 40,
    },
    legend: [
      {
        orient: "vertical",
        top: 0,
        right: 0,
      },
    ],
    series: [
      {
        emphasis: {
          focus: "series",
        },
        categories: [
          {
            name: "管理端",
            itemStyle: {
              color: "#e9a3a3",
            },
            label: {
              color: "#fff",
            },
          },
          {
            name: "中心端",
            itemStyle: {
              color: "#0d8383",
            },
          },
          {
            name: "用户端",
            itemStyle: {
              color: "#f3c291",
            },
            label: {
              color: "#fff",
            },
          },
        ],

        type: "graph",
        layout: "none",
        draggable: false,
        symbolSize: 60,
        roam: true,
        label: {
          show: true,
          fontSize: 16,
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 10],
        data: [],
        links: [],
        force: {
          repulsion: 500,
          layoutAnimation: true,
        },
        zoom: 0.8,
        lineStyle: {
          width: 3,
        },
        animation: false,
      },
    ],
    animation: false,
  });

  useEffect(() => {
    connectToWebsocket().then((socket) => {
      let lastData = {};
      socket?.addEventListener("message", (ev) => {
        const message = ev.data;
        if (message) {
          const { data, links } = parseMessage(message);
          let newData = data;
          if (exclude) {
            newData = data.filter((item) => !exclude.includes(item.category));
          }
          const series = {
            data: newData,
            links,
            force: {
              repulsion: 500,
              edgeLength: 100,
              gravity: 0.05,
            },
          };

          update({ series }, { series: lastData });

          lastData = series;
        }
      });
    });

    myChart.current?.on("click", (params) => {
      onNodeClick && onNodeClick(params.name);
    });
  }, [connectToWebsocket]);

  const parseMessage = useCallback((message: string) => {
    const parseMsg: TopologyData = JSON.parse(message);
    const { nodes, links } = parseMsg.data;
    // const { manage, center, user } = nodes;
    // const nodeArr = [...manage.map((item) => ({ name: item, category: 0, x: 0, y: 0 })), ...center.map((item) => ({ name: item, category: 1 })), ...user.map((item) => ({ name: item, category: 2 }))];
    const nodeArr = generateCoordinates(nodes);
    const linkArr = links.map((item) => ({ source: item[0], target: item[1] }));

    return { data: nodeArr, links: linkArr };
  }, []);

  // 动态生成坐标
  function generateCoordinates(nodes) {
    const xCenter = 500; // 中心 x 坐标，可以根据图表宽度调整
    const yPositions = {
      manage: 200, // 管理端在中央
      center: 400, // 中心端在管理端下方
      user: 600, // 接点端在中心端下方
    };

    const result: any[] = [];

    // 设置管理端节点的位置
    nodes.manage.forEach((id, index) => {
      result.push({
        name: id,
        x: xCenter + index * 200, // 管理端在水平中央
        y: yPositions.manage,
        category: 0,
        symbol: "rect",
      });
    });

    // 设置中心端节点的位置，均匀分布在管理端下方
    nodes.center.forEach((id, index) => {
      result.push({
        name: id,
        x: xCenter + index * 200, // 水平均匀分布
        y: yPositions.center,
        category: 1,
        symbol: "roundRect",
      });
    });

    // 设置接点端节点的位置，均匀分布在中心端下方
    nodes.user.forEach((id, index) => {
      result.push({
        name: id,
        x: xCenter - 100 + index * 200, // 水平均匀分布
        y: yPositions.user,
        category: 2,
      });
    });

    return result;
  }
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full " ref={(dom) => (domRef.current = dom)}></div>
      <div className="absolute left-40 top-10">{tips && <Alert className="h-7 text-xs" type="warning" message={tips} showIcon />}</div>
    </div>
  );
}

export default Topology;
