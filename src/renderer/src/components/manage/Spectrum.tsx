import { Flex, Form, InputNumber } from "antd"
import { useCallback, useEffect, useRef, useState } from "react"
import useWebSocketConnect from "@/hooks/useWebsocketConnect"
import useEcharts from "@/hooks/useEcharts"
import { useDebounce } from "@uidotdev/usehooks"
import Test from "./Test"

// prettier-ignore
const xAxisData = Array(32).fill(0)
// prettier-ignore
const days = Array(100).fill(0)
// prettier-ignore
const colors = ["#efbe8d", "#71b4b9", "#e9a3a3"]
const option = {
  title: {
    text: `子网1干扰业务分布`,
    top: "0px",
    left: "4%",
    textStyle: {
      fontSize: 24,
      color: "#000",
    },
  },
  tooltip: {
    position: "top",
    formatter: (params: any) => {
      switch (params.data[2]) {
        case 1:
          return "干扰"
        case 2:
          return "业务"
        case 3:
          return "冲突"
      }
    },
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
  legend: {
    show: true,
  },
  visualMap: {
    pieces: [
      { value: 1, label: "干扰", color: colors[0] },
      { value: 2, label: "业务", color: colors[1] },
      { value: 3, label: "冲突", color: colors[2] },
    ],
    // outOfRange: {
    //   color: "#fff", // 其他值的颜色
    // },
    min: 1,
    max: 3,
    show: true,
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
      // emphasis: {
      //   itemStyle: {
      //     shadowBlur: 10,
      //     shadowColor: "rgba(0, 0, 0, 0.5)",
      //   },
      // },
    },
  ],
  animation: false,
}

function Index() {
  return (
    // <Test />
    <div className="w-full h-full pt-2 pb-10">
      <div className="float-left w-1/2 h-full min-w-1 min-h-1">
        <h1 className="text-center">子网1用频状态</h1>
        <Spectrum />
      </div>
      <div className="float-right w-1/2 h-full min-w-1 min-h-1">
        <h1 className="text-center">子网2用频状态</h1>
        <Spectrum />
      </div>
    </div>
  )
}
function Spectrum() {
  const { domRef, update } = useEcharts(option)
  const { connectToWebsocket, close, message } = useWebSocketConnect("manage-spectrum-status")
  const [limit, setLimit] = useState(5000)
  const [barData, setBarData] = useState<any[]>([])
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const debouncedLimit = useDebounce(limit, 500)

  const seriesData = useRef<any[]>([])

  useEffect(() => {
    connectToWebsocket()

    return () => {
      close()
    }
  }, [close, connectToWebsocket])

  const updateData = useCallback((message: string, limit: number) => {
    try {
      const parseMsg = JSON.parse(message) as number[]
      const mapData = [] as number[]
      const newMessage = parseMsg.map((item, index) => {
        if (item >= limit) {
          mapData[index] = 1
          return {
            value: item,
            itemStyle: {
              color: colors[0],
            },
          }
        }
        mapData[index] = 0
        return item
      })
      setHeatmapData([...mapData]) // 更新热力图数据
      setBarData(newMessage) // 更新柱状图数据
    } catch (error) {
      // console.log("error", error)
    }
  }, [])
  useEffect(() => {
    updateData(message, debouncedLimit)
  }, [message, debouncedLimit, updateData])

  // 解析热力图数据显示
  const parseData = useCallback(
    (data: number[]) => {
      // 解析数据
      const parseArr = data
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
      update({
        series: [{ data: seriesData.current }],
      })
    },
    [update]
  )
  useEffect(() => {
    parseData(heatmapData)
  }, [parseData, heatmapData])

  return (
    <div className="w-full h-full grid grid-rows-[auto_7fr_3fr]">
      <Form.Item labelCol={{ offset: 7 }} className="m-0" label="干扰定义设置">
        <InputNumber
          defaultValue={limit}
          onChange={(value) => value && setLimit(value)}
          className="w-40"
          min={1}
          max={65536}
        />
      </Form.Item>

      <div className="min-w-1 min-h-1">
        <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
      </div>

      <div className="min-w-1 min-h-1">
        <BarOfSpectrum limit={debouncedLimit} data={barData} />
      </div>
    </div>
  )
}
export default Index

function generageXData() {
  const start = 230
  const end = 670
  const numCategories = 32

  // 计算每个类别的间隔
  const interval = (end - start) / (numCategories - 1)

  // 生成类别数组
  const categories = Array.from({ length: numCategories }, (_, index) => {
    return (start + index * interval).toFixed(2) // 保留两位小数
  })
  return categories
}
const barOption = {
  xAxis: {
    type: "category",
    data: generageXData(),
    // show: false,
    // splitArea: {
    //   show: true,
    // },
    axisLabel: {
      show: true,
      interval: 0,
      // rotate: 30,
    },
    axisTick: {
      show: false,
    },
  },
  grid: {
    top: 10,
    height: "90%",
  },
  yAxis: {
    type: "value",
    min: 0,
    max: 65536,
  },
  series: [
    {
      type: "bar",
      data: [],
      itemStyle: {
        // color: "#4CAF50", // 柱子的颜色
      },
    },
  ],
  animation: false,
}

function BarOfSpectrum({ data, limit }: { data: any; limit: number }) {
  const { domRef, update, myChart } = useEcharts(barOption)

  useEffect(() => {
    const xAxis = {
      axisLabel: {
        show: true,
        formatter: (value, index) => {
          const valueToShow = data[index] // 假设 data 是对应的值
          if (valueToShow?.value >= limit) {
            return value + "MHz"
          } else {
            return ""
          }
        },
      },
    }
    update({
      xAxis,
      series: [{ data: data ?? [] }],
    })
  }, [data, update, limit])

  useEffect(() => {
    myChart.current?.on("click", () => {
      console.log("clicked")
    })
  }, [myChart])
  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
}
