import { Divider } from "antd";
import useECharts from "@/hooks/useEcharts";
import { useEffect, useCallback } from "react";

import useWebsocket from "@/hooks/useWebsocket";
import useConnect from "@/hooks/useConnect";


function Network() {
  const { domRef, update } = useECharts({
    "title": {
      "text": "网络拓扑",
      "textStyle": {
        "fontSize": 24,
        "color": "#000"
      },
      "top": 40,
      "left": 40
    },
    "legend": [
      {
        "orient": "vertical",
        "top": 0,
        "right": 0
      }
    ],
    "series": [
      {
        "emphasis": {
          "focus": "series"
        },
        "categories": [{ name: "管理端" }, { name: "中心端" }, { name: "用户端" }],

        "type": "graph",
        "layout": "force",
        "draggable": true,
        "symbolSize": 60,
        "roam": true,
        "label": {
          "show": true,
          fontSize: 16
        },
        "edgeSymbol": [
          "circle",
          "arrow"
        ],
        "edgeSymbolSize": [
          4,
          10
        ],
        "data": [],
        "links": [],
        force: {
          repulsion: 500,
          layoutAnimation: true
        },
        lineStyle: {
          width: 3
        },
        "animation": false,
      }
    ],
    "animation": false
  });

  const { message, connect } = useWebsocket();
  const connectInfo = useConnect()


  useEffect(() => {
    const { isConnect, address, port } = connectInfo
    if (isConnect) {
      const url = `ws://${address}:${port}/topology`
      connect(url);
    }
  }, [connect, connectInfo]);

  const parseMessage = useCallback((message: string) => {
    const parseMsg: TopologyData = JSON.parse(message);
    const { nodes: { manage, center, user }, links } = parseMsg.data;
    const nodeArr = [
      ...manage.map(item => ({ name: item, category: 0, x: 0, y: 0 })),
      ...center.map(item => ({ name: item, category: 1 })),
      ...user.map(item => ({ name: item, category: 2 })),
    ];

    const linkArr = links.map(item => ({ source: item[0], target: item[1] }));

    return { data: nodeArr, links: linkArr };
  }, []);

  useEffect(() => {
    if (message) {
      const { data, links } = parseMessage(message);
      const series = {
        data,
        links,
        force: {
          repulsion: 500,
          edgeLength: 100,
          gravity: 0.05,
        }
      };
      update({ series });
    }
  }, [message, update, parseMessage]);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col gap-6 w-96 p-10 m-4">
        <h1 className="font-bold text-2xl">网络列表</h1>
        <ul className="flex flex-col gap-6">
          <li>网络节点数目： 未选择</li>
          <li>当前工作频段： -10MHz-150MHz</li>
          <li>{connectInfo.isConnect ? "true" : "false"}</li>
        </ul>
      </div>
      <Divider type="vertical" className="h-full" />
      <div className="flex-1 p-2">
        <div className="w-full h-full" ref={domRef}></div>
      </div>
    </div>
  );
}

export default Network;
