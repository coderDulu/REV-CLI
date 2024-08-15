import useEcharts from "@/hooks/useEcharts";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { useCallback, useEffect } from "react";

function NodeBar({ node }: { node: string }) {
  const { connectToWebsocket, websocketRef } = useWebsocketConnect("node-bar");
  const { domRef, update } = useEcharts({
    title: {
      text: "节点频段能量分布",
      top: 10,
      left: 40,
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
    },
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 120,
      show: false,
    },
    series: [
      {
        data: [],
        type: "bar",
        label: {
          show: true,
          formatter: (params: any) => {
            const value = params.value - 60;
            return value.toFixed(2);
          },
        },
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  });

  useEffect(() => {
    connectToWebsocket();
  }, [connectToWebsocket]);

  const parseData = useCallback(
    (ev) => {
      try {
        const message = JSON.parse(ev.data);
        const showData = message.find((item) => item.node_mac === Number(node)) ?? message.at(-1);
        if (showData) {
          const { tunnel, node_mac } = showData;
          update({
            title: {
              text: `节点${node_mac}频段能量分布`,
            },
            series: {
              data: tunnel,
            },
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    [node]
  );

  useEffect(() => {
    const ws = websocketRef.current;
    ws?.addEventListener("message", parseData);

    return () => {
      ws?.removeEventListener("message", parseData);
    };
  }, [parseData, websocketRef]);

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>;
}

export default NodeBar;
