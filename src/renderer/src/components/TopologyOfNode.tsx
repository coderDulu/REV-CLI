// 用户节点互相连接的拓扑关系

import useEcharts from "@/hooks/useEcharts"
import { STYLES } from "./Topology"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useEffect } from "react"
import { ids } from "@/hooks/useConnect"

const option = {
  title: {
    text: "网络拓扑",
  },
  series: [
    {
      type: "graph",
      layout: "none",
      symbolSize: 50,
      roam: true,
      label: {
        show: true,
      },
      edgeSymbol: ["circle", "arrow"],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        fontSize: 20,
      },
      data: [
        {
          name: "Node 1",
          x: 300,
          y: 300,
        },
        {
          name: "Node 2",
          x: 800,
          y: 300,
        },
        {
          name: "Node 3",
          x: 550,
          y: 100,
        },
        {
          name: "Node 4",
          x: 550,
          y: 500,
        },
      ],
      // links: [],
      links: [
        {
          source: 0,
          target: 1,
          symbolSize: [5, 20],
          label: {
            show: true,
          },
          lineStyle: {
            width: 5,
            curveness: 0.2,
          },
        },
        {
          source: "Node 2",
          target: "Node 1",
          label: {
            show: true,
          },
          lineStyle: {
            curveness: 0.2,
          },
        },
        {
          source: "Node 1",
          target: "Node 3",
        },
        {
          source: "Node 2",
          target: "Node 3",
        },
        {
          source: "Node 2",
          target: "Node 4",
        },
        {
          source: "Node 1",
          target: "Node 4",
        },
      ],
      lineStyle: {
        opacity: 0.9,
        width: 2,
        curveness: 0,
      },
    },
  ],
}
function TopologyOfNode() {
  const { connectToWebsocket, message } = useWebsocketConnect("topology")

  useEffect(() => {
    connectToWebsocket()
  }, [connectToWebsocket])

  useEffect(() => {
    if (message) {
      const data = JSON.parse(message)
      console.log(data)
    }
  }, [message])

  const { domRef } = useEcharts(option)
  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
}

export default TopologyOfNode
