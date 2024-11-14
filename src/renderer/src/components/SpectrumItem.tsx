/**
 * 瀑布图
 */
import useEcharts from "@/hooks/useEcharts"
import { useDebounce } from "@uidotdev/usehooks"
import { Form, InputNumber } from "antd"
import { useCallback, useEffect, useRef, useState } from "react"
import BarOfSpectrum from "./SpectrumItemBar"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { YMAX, YMIN } from "@/utils/global"

type Message = {
  network: number
  data: number[]
  startFreq: number
  endFreq: number
}[]
// prettier-ignore
const xAxisData = Array(32).fill(0)
// prettier-ignore
const days = Array(100).fill(0)
// prettier-ignore
const colors = ["#efbe8d", "#71b4b9", "#e9a3a3"]
const option = {
  // title: {
  //   text: `子网1干扰业务分布`,
  //   top: "0px",
  //   left: "4%",
  //   textStyle: {
  //     fontSize: 18,
  //     color: "#000",
  //   },
  // },
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

function SpectrumItem({ network, title }: { network: string | number; title?: string }) {
  const { domRef, update } = useEcharts(option)
  const { connectToWebsocket } = useWebsocketConnect("manage-spectrum-status")
  const [limit, setLimit] = useState(10)
  const [barData, setBarData] = useState<any[]>([])
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const debouncedLimit = useDebounce(limit, 1000)
  const [xRange, setXRange] = useState([230, 670])

  const seriesData = useRef<any[]>([])

  const updateData = useCallback((message: number[], limit: number) => {
    try {
      const mapData = [] as number[]
      const newMessage = message.map((item, index) => {
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
      console.log("SpectrumItem error ", error)
    }
  }, [])

  const handleMessage = useCallback(
    (message: string) => {
      try {
        const parseData = JSON.parse(message) as Message
        const findMsg = parseData.find((item) => item.network === +network)
        if (findMsg) {
          const { startFreq, endFreq } = findMsg
          setXRange([startFreq, endFreq])
          updateData(findMsg.data, debouncedLimit)
        }
      } catch (error) {
        console.log("error", message)
      }
    },
    [debouncedLimit, network, updateData]
  )

  useEffect(() => {
    connectToWebsocket(handleMessage)
  }, [connectToWebsocket, handleMessage])

  useEffect(() => {
    window.$message.info(`子网${network ?? ""}干扰定义设置为: ${debouncedLimit}`)
  }, [debouncedLimit, network])

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
        // title: { text: `子网${network}干扰业务分布` },
        series: [{ data: seriesData.current }],
      })
    },
    [update]
  )

  useEffect(() => {
    parseData(heatmapData)
  }, [parseData, heatmapData])

  return (
    <div className="w-full h-full relative">
      <h1 className="text-center text-xl mb-2">{title ?? "用频状态"}</h1>

      <Form.Item labelCol={{ offset: 7 }} className="m-0" label="干扰定义设置">
        <InputNumber
          defaultValue={limit}
          onChange={(value) => value && setLimit(value)}
          className="w-40"
          min={YMIN}
          max={YMAX}
        />
      </Form.Item>

      <div className="w-full absolute" style={{ top: "50px", height: "70%" }}>
        <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
      </div>

      <div className="w-full absolute" style={{ top: "calc(50px + 70%)", height: "30%" }}>
        <BarOfSpectrum xRange={xRange} limit={debouncedLimit} data={barData} />
      </div>
    </div>
  )
}

export default SpectrumItem
