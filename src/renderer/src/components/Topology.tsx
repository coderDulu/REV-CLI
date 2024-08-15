import useECharts from "@/hooks/useEcharts";
import { useCallback, useEffect } from "react";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";

function Topology() {
  const { connectToWebsocket } = useWebsocketConnect("topology");
  const { domRef, update } = useECharts({
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
        categories: [{ name: "管理端" }, { name: "中心端" }, { name: "用户端" }],

        type: "graph",
        layout: "force",
        draggable: true,
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
          const series = {
            data,
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
  }, [connectToWebsocket]);

  const parseMessage = useCallback((message: string) => {
    const parseMsg: TopologyData = JSON.parse(message);
    const {
      nodes: { manage, center, user },
      links,
    } = parseMsg.data;
    const nodeArr = [...manage.map((item) => ({ name: item, category: 0, x: 0, y: 0 })), ...center.map((item) => ({ name: item, category: 1 })), ...user.map((item) => ({ name: item, category: 2 }))];

    const linkArr = links.map((item) => ({ source: item[0], target: item[1] }));

    return { data: nodeArr, links: linkArr };
  }, []);

  return (
    <>
      <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
    </>
  );
}

export default Topology;
