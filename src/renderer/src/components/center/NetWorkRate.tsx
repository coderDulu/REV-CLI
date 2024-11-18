import useECharts from "@/hooks/useEcharts"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useCallback, useEffect, useRef, useState } from "react"
import YaxisRangeSet from "../YaxisRangeSet"

// 频谱管控状态

export default function SpectrumStatus() {
  const { domRef, update } = useECharts({
    grid: {
      bottom: "8%",
      left: "10%",
      // height: "199%",
    },
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        axis: "x",
      },
    },
    toolbox: {
      show: true,
    },
    xAxis: {
      name: "时间/s",
      type: "category",
      boundaryGap: false,
      min: 0,
      max: 60,
      axisTick: {
        show: false,
      },
    },
    legend: {},
    yAxis: {
      type: "value",
      name: "速率 (Byte/s)", // y 轴名称
      min: 0,
      max: 70 * 1024,
      // axisLabel: {
      //   formatter: function (value) {
      //     return value + ' Byte/s';
      //   }
      // }
    },
    series: [
      {
        type: "line",
        data: [],
        smooth: false,
        showSymbol: false,
        sampling: "lttb",
        large: true,
        largeThreshold: 1000,
        itemStyle: {
          color: "#0d8383",
        },
      },
    ],
    animation: false,
    title: {
      text: "实时网络传输速率",
      top: 0,
      left: 20,
      textStyle: {
        fontSize: 18,
        color: "#000",
      },
    },
  })
  const onMessage = useCallback(
    (message: string) => {
      try {
        const { rate } = JSON.parse(message)
        const currentTime = Date.now() / 1000 // 当前时间秒数
        // 如果这是第一次添加数据，则记录起始时间
        if (!startTime.current) {
          startTime.current = currentTime
        }
        // 计算相对时间，作为 x 轴的刻度
        const relativeTime = currentTime - startTime.current
        xAxisData.current.push(
          Number.isInteger(relativeTime) ? relativeTime + "" : relativeTime.toFixed(1)
        )

        // add data
        lastData.current.push(rate)
        if (lastData.current.length > 60) {
          lastData.current.shift()
          xAxisData.current.shift()
        }
        const option = {
          xAxis: {
            data: xAxisData.current,
          },
          series: [
            {
              data: lastData.current,
            },
          ],
        }
        update(option)
      } catch (error) {
        console.log("SpectrumStatus", error)
      }
    },
    [update]
  )

  const { connectToWebsocket } = useWebsocketConnect("net-rate", onMessage)
  const startTime = useRef<number>(0)
  const xAxisData = useRef<string[]>([])

  useEffect(() => {
    connectToWebsocket()
    return () => {
      startTime.current = 0
      xAxisData.current = []
    }
  }, [connectToWebsocket])

  const lastData = useRef<number[][]>([])

  // 控制y轴范围
  const [show, setShow] = useState(false)
  const handleRangeSubmit = (values) => {
    update({
      yAxis: {
        min: values.min,
        max: values.max,
      },
    })
    setShow(false)
  }
  return (
    <>
      <div
        onClick={() => setShow(true)}
        className="w-full h-full"
        ref={(dom) => (domRef.current = dom)}
      ></div>
      <YaxisRangeSet
        onClose={() => setShow(false)}
        visible={show}
        onRangeSubmit={handleRangeSubmit}
      />
    </>
  )
}
