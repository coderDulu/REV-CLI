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

// 动态生成坐标\
type TopologyNodes = {
  manage: number[]
  center: number[]
  user: number[]
  links: number[][]
}

function Topology({ onNodeClick, tips, exclude }: Props) {
  const { connectToWebsocket, message } = useWebsocketConnect("topology")
  const { domRef, update, myChart } = useECharts({
    title: {
      text: "网络拓扑",
      textStyle: {
        fontSize: 18,
        color: "#000",
      },
      top: 40,
      left: 40,
    },
    legend: [
      {
        orient: "vertical",
        top: 10,
        right: 10,
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
        symbolSize: 80,
        roam: true,
        label: {
          show: true,
          fontSize: 16,
          formatter: function (params) {
            return params.name.replace(/(\d+)/, "$1\n") // 根据需要调整分隔符
          },
        },
        // edgeSymbol: ["circle", "circle"],
        // edgeSymbolSize: [4, 10],
        data: [],
        links: [],
        force: {
          repulsion: 500,
          layoutAnimation: false,
        },
        zoom: 0.8,
        lineStyle: {
          width: 3,
        },
        animation: false,
      },
    ],
    animation: false,
  })

  useEffect(() => {
    connectToWebsocket()

    const onMessage = (params) => {
      onNodeClick && onNodeClick(params.name)
    }
    const myCharts = myChart.current

    myCharts?.on("click", onMessage)

    return () => {
      myCharts?.off("click", onMessage)
    }
  }, [connectToWebsocket])

  let lastData = {}
  useEffect(() => {
    if (message) {
      const { data, links } = parseMessage(message)
      let newData = data
      if (exclude) {
        newData = data.filter((item) => !exclude.includes(item.category))
      }
      const series = {
        data: newData,
        links,
        force: {
          repulsion: 500,
          edgeLength: 100,
          gravity: 0.05,
        },
      }

      update({ series }, { series: lastData })

      lastData = series
    }
  }, [message])

  const parseMessage = useCallback((message: string) => {
    const parseMsg: TopologyData = JSON.parse(message)
    const { links, ...nodes } = parseMsg
    const nodeArr = generateCoordinates(nodes)
    const linkArr = links.map((item) => ({ source: item[0] + "", target: item[1] + "" }))

    return { data: nodeArr, links: linkArr }
  }, [])
  function generateCoordinates(nodes: TopologyNodes) {
    const xCenter = 500 // 中心 x 坐标
    const yPositions = {
      manage: 200, // 管理端在中央
      center: 400, // 中心端在管理端下方
      user: 600, // 接点端在中心端下方
    }

    const result: any[] = []

    // 设置管理端节点的位置
    if (nodes.manage.length > 0) {
      nodes.manage.forEach((id) => {
        result.push({
          name: ids[id],
          id: +id,
          x: xCenter, // 管理端在水平中央
          y: yPositions.manage,
          category: 0,
          symbol: "rect",
        })
      })
    }

    // 设置中心端节点的位置
    if (nodes.center.length > 0) {
      const centerSpacing = nodes.center.length > 1 ? 300 : 0 // 多个中心节点时才增加间距
      nodes.center.forEach((id, index) => {
        const xOffset = (index - (nodes.center.length - 1) / 2) * centerSpacing // 增加中心节点的水平间距
        result.push({
          name: ids[id],
          id: +id,
          x: xCenter + xOffset,
          y: yPositions.center,
          category: 1,
          symbol: "roundRect",
        })
      })
    }

    // 设置接点端节点的位置
    if (nodes.user.length > 0) {
      // 计算每个中心节点对应的用户数量
      const totalUsersForCenter = Math.ceil(nodes.user.length / (nodes.center.length || 1)) // 避免除以0
      nodes.user.forEach((id, index) => {
        // 计算叶子节点属于哪个中心节点
        const centerIndex = Math.floor(index / totalUsersForCenter)
        const userIndexInCenter = index % totalUsersForCenter // 该用户在所属中心节点中的序号
        const offsetX = 200 // 偏移量

        // 计算叶子节点的水平偏移
        const sideOffset = (userIndexInCenter - (totalUsersForCenter - 1) / 2) * offsetX // 动态计算每个叶子节点的水平位置

        // 基于对应的中心端节点 x 坐标
        const centerNodeX =
          result.find((node) => node.id === +nodes.center[centerIndex])?.x || xCenter

        result.push({
          name: ids[id],
          id: +id,
          x: centerNodeX + sideOffset,
          y: yPositions.user,
          category: 2,
        })
      })
    }

    return result
  }

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
