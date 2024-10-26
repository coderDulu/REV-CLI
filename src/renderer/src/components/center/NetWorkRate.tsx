import useECharts from "@/hooks/useEcharts"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useEffect, useRef } from "react"

// 频谱管控状态
export default function SpectrumStatus() {
  const { connectToWebsocket } = useWebsocketConnect("net-rate")
  const { domRef, update } = useECharts({
    grid: {
      bottom: "8%",
      left: "10%",
      height: "70%",
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
      max: 70000,
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
      top: 10,
      left: 20,
      textStyle: {
        fontSize: 18,
        color: "#000",
      },
    },
  })

  const startTime = useRef<number>(0)
  const xAxisData = useRef<string[]>([])
  useEffect(() => {
    connectToWebsocket().then((socket) => {
      const lastData: number[][] = []
      socket?.addEventListener("message", (ev) => {
        try {
          const { rate } = JSON.parse(ev.data)
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
          lastData.push(rate)
          if (lastData.length > 60) {
            lastData.shift()
            xAxisData.current.shift()
          }
          const option = {
            xAxis: {
              data: xAxisData.current,
            },
            series: [
              {
                data: lastData,
              },
            ],
          }
          update(option)
        } catch (error) {
          console.log("SpectrumStatus", error)
        }
      })
    })
    return () => {
      startTime.current = 0
      xAxisData.current = []
    }
  }, [connectToWebsocket, update])

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
}
