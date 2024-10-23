import useECharts from "@/hooks/useEcharts"
import { useCallback, useEffect } from "react"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { Alert } from "antd"
import { ids } from "@/hooks/useConnect"

interface Props {
  tips?: string
  exclude?: number[] // 不显示节点 0, 1, 2 / 管理端、中心端、节点段
  onNodeClick?: (chooseNode: string) => void
}

const STYLES = {
  manage: {
    itemStyle: {
      color: "#ffb3b3",
    },
    symbol: "rect",
  },
  center: {
    itemStyle: {
      color: "#0d8383",
    },
    symbol: "roundRect",
  },
  user: {
    itemStyle: {
      color: "#f3c291",
    },
    symbol: "circle",
  },
}
function Topology({ onNodeClick, tips, exclude }: Props) {
  const { connectToWebsocket } = useWebsocketConnect("topology")
  const { domRef, update, myChart, isSame } = useECharts({
    title: {
      text: "网络拓扑",
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
      top: 40,
      left: 40,
    },
    series: [
      {
        type: "tree",
        symbolSize: 70, // 节点的大小
        label: {
          show: true,
          fontSize: 16,
          formatter: function (params) {
            return params.name.replace(/(\d+)/, "$1\n") // 根据需要调整分隔符
          },
          color: "#fff",
        },
        data: [],
        layout: "orthogonal", // 使用正交布局
        orient: "vertical", // 树的方向，垂直
        lineStyle: {
          color: "#d4d4d4",
          width: 2,
          curveness: 0, // 控制线条的弯曲度
        },
        expandAndCollapse: false,
      },
    ],
  })

  useEffect(() => {
    connectToWebsocket().then((socket) => {
      let lastData = {}
      socket?.addEventListener("message", (ev) => {
        const message = ev.data
        if (message) {
          const { data } = JSON.parse(message)

          const treeData = buildTree(data.nodes, data.links)
          if (!isSame(lastData, treeData)) {
            update({ series: [{ data: [treeData] }] })
          }

          lastData = treeData
        }
      })
    })

    myChart.current?.on("click", (params) => {
      onNodeClick && onNodeClick(params.name)
    })
  }, [connectToWebsocket])

  return (
    <div className="w-full h-full relative min-h-0 min-w-0">
      <div className="w-full h-full " ref={(dom) => (domRef.current = dom)}></div>
      <div className="absolute left-40 top-10">
        {tips && <Alert className="h-7 text-xs" type="warning" message={tips} showIcon />}
      </div>
    </div>
  )
}

export default Topology

/**
 * 生成echarts的树状图数据

 * @param nodes nodes: {
            manage: ["0"],
            center: ["4", "8"],
            user: ["5", "6", "9", "10"],
          },
 * @param links [
            ["0", "4"],
            ["0", "8"],
            ["4", "5"],
            ["4", "6"],
            ["8", "9"],
            ["8", "10"]
          ],
 * @returns 
 */
function buildTree(nodes, links) {
  const nodeMap = {}

  // 创建节点对象
  Object.keys(nodes).forEach((key) => {
    const style = STYLES[key]
    nodes[key].forEach((id) => {
      const name = ids[id]
      nodeMap[id] = { name, children: [], ...style }
    })
  })

  // 连接节点
  links.forEach((link) => {
    const [parentId, childId] = link
    if (nodeMap[parentId]) {
      nodeMap[parentId].children.push(nodeMap[childId])
    }
  })

  // 返回管理端的根节点
  return nodeMap[nodes.manage[0]]
}
