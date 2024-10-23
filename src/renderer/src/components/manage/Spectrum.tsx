import { useHeatmap } from "@/hooks/useHeatmap"
import { Flex } from "antd"
import { useCallback, useEffect, useRef } from "react"
import useWebSocketConnect from "@/hooks/useWebsocketConnect"
import useEcharts from "@/hooks/useEcharts"

// prettier-ignore
const xAxisData = Array(32).fill(0)
// prettier-ignore
const days = Array(100).fill(0)
// prettier-ignore
const colors = ["#efbe8d", "#71b4b9", "#e9a3a3"]
const option = {
  title: {
    text: `子网1干扰业务分布`,
    top: "2px",
    left: "4%",
    textStyle: {
      fontSize: 24,
      color: "#000",
    },
  },
  tooltip: {
    position: "top",
  },
  grid: {
    // height: "50%",
    // top: "10%",
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
    name: "时间",
    type: "category",
    data: days,
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
      { min: 1, max: 1, label: "干扰", color: colors[0] },
      { min: 2, max: 2, label: "业务", color: colors[1] },
      { min: 3, max: 3, label: "冲突", color: colors[2] },
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
      type: "heatmap",
      data: [],
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      animation: false,
    },
  ],
  animation: false,
}

function Spectrum() {
  const { domRef, update } = useEcharts(option)
  const { connectToWebsocket, close } = useWebSocketConnect("freq-status")

  const parseData = useCallback(() => {}, [])
  const seriesData = useRef<any[]>([])
  useEffect(() => {
    const interval = setInterval(() => {
      // const randomArr = Array(32).fill(0).map(item => {
      //   return Math.floor(Math.random() * 3 + 1)
      // })
      const randomArr = Array(32).fill(0)

      // 随机选择两个不同的索引
      const indices = new Set()
      while (indices.size < 2) {
        indices.add(Math.floor(Math.random() * 32))
      }

      // 将这两个索引的值设置为随机数（1-3）
      indices.forEach((index) => {
        randomArr[index] = Math.floor(Math.random() * 3) + 1
      })

      const parseArr = randomArr
        .map((item, index) => {
          if (item !== 0) {
            return [index, 0, item]
          }
        })
        .filter(Boolean)

      seriesData.current = seriesData.current.filter((item) => item[1] <= option.yAxis.data.length)
      seriesData.current.forEach((item) => {
        item[1]++
      })
      seriesData.current.push(...parseArr)
      console.log("seriesData", seriesData.current.length)

      update({
        series: [{ data: seriesData.current }],
      })
    }, 100)

    return () => {
      interval && clearInterval(interval)
    }
  }, [])

  return (
    <Flex vertical gap={10} className="w-full h-full">
      <div className="flex-1 min-h-0" ref={(dom) => (domRef.current = dom)}></div>
      <div className="flex-1 min-h-0" ref={(dom) => (domRef.current = dom)}></div>
    </Flex>
  )
}

export default Spectrum
