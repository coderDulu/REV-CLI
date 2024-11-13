/**
 * @description: 频谱管控状态，单个子网使用
 *
 */
import useECharts from "@/hooks/useEcharts"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useCallback, useEffect, useRef } from "react"

// 频谱管控状态
export default function SpectrumStatus({
  onFreqChange,
}: {
  onFreqChange?: (freq: number[]) => void
}) {
  const { connectToWebsocket } = useWebsocketConnect("spectrum-status")
  const { domRef, update } = useECharts({
    title: {
      text: `频谱管控状态`,
      top: 20,
      left: 40,
      textStyle: {
        fontSize: 18,
        color: "#000",
      },
    },
    tooltip: {
      formatter: (params: any) => {
        if (params.seriesName == "受控") {
          return "受控频段"
        } else {
          return "未受控频段"
        }
      },
    },
    legend: {
      selectedMode: true,
      top: "20%",
    },
    grid: {
      height: "50%",
      top: "50%",
      containLabel: true,
      left: "4%",
    },
    xAxis: {
      type: "value",
      min: 230,
      max: 670,
    },
    yAxis: {
      type: "category",
      data: ["频谱"],
      show: false,
    },
    series: [
      {
        name: "未受控",
        id: "1",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [300],
        itemStyle: {
          color: "#81dae0", // Change this to your desired color
        },
      },
      {
        name: "受控",
        id: "2",
        type: "bar",
        stack: "total",
        label: {
          show: true,
          formatter: "受控区间",
        },
        emphasis: {
          focus: "series",
        },
        data: [160],
        itemStyle: {
          color: "#efbe8d", // Change this to your desired color
        },
      },
      {
        name: "未受控",
        id: "3",
        type: "bar",
        stack: "total",
        label: {
          show: false,
        },
        emphasis: {
          focus: "series",
        },
        data: [678],
        itemStyle: {
          color: "#81dae0", // Change this to your desired color
        },
      },
    ],
  })

  const lastData = useRef({})
  const onMessage = useCallback(
    (message: string) => {
      try {
        const { startFreq, endFreq } = JSON.parse(message)
        onFreqChange && onFreqChange([startFreq, endFreq])
        const option = {
          series: [
            {
              id: "1",
              data: [startFreq],
            },
            {
              id: "2",
              label: {
                show: true,
                formatter: startFreq + "MHz-" + endFreq + "MHz",
                fontSize: 15,
                fontWeight: "bolder",
              },
            },
          ],
        }
        update(option, lastData.current)
        lastData.current = option
      } catch (error) {
        console.warn("SpectrumStatus", error)
      }
    },
    [onFreqChange, update]
  )

  useEffect(() => {
    connectToWebsocket(onMessage)
  }, [connectToWebsocket, onMessage])

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
}
