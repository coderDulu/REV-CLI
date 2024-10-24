import useECharts from "@/hooks/useEcharts"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useCallback, useEffect } from "react"

type DataType = {
  network: number
  freqBand: number[]
  mode: number
  bandSelect: number
  freq: number
}[]

const unusedColor = "#66ffff" // 所有未使用的颜色
const subnet1Color = "#ffcc00" // 子网1的颜色
const subnet2Color = "#ff7c80" // 子网2的颜色
const startFreq = 230
const endFreq = 670

const option = {
  // tooltip: {
  //   trigger: "axis",
  //   axisPointer: {
  //     // Use axis to trigger tooltip
  //     type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
  //   },
  // },
  title: {
    text: "频谱使用状态",
    textStyle: {
      fontSize: 24,
      color: "#000",
    },
    top: 4,
    left: 40,
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    height: 100,
    containLabel: true,
  },
  xAxis: {
    type: "value",
    min: 230,
    max: 670,
  },
  yAxis: {
    type: "category",
    data: ["Mon"],
    show: false,
  },
  series: [
    {
      name: "未使用",
      type: "bar",
      stack: "total",
      label: {
        show: false,
      },
      emphasis: {
        focus: "series",
      },
      data: [startFreq],
    },
    {
      name: "子网1使用",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [160],
    },
    {
      id: 2,
      name: "未使用",
      type: "bar",
      stack: "total",
      label: {
        show: false,
      },
      emphasis: {
        focus: "series",
      },
      data: [10],
    },
    {
      name: "子网2使用",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [160],
    },
    {
      name: "未使用",
      type: "bar",
      stack: "total",
      label: {
        show: false,
      },
      emphasis: {
        focus: "series",
      },
      data: [endFreq],
    },
  ],
}

function SpectrumBar() {
  const { connectToWebsocket } = useWebsocketConnect("manage-network-info")
  const { domRef, update } = useECharts(option)

  const parseData = useCallback((data) => {
    try {
      const parse = JSON.parse(data) as DataType
      const sortData = parse.sort((a, b) => a.freqBand[0] - b.freqBand[0])

      const seriesData: any[] = []

      sortData.forEach((item, index) => {
        const { freqBand, network } = item
        const [start, end] = freqBand

        if (index === 0) {
          seriesData.push({
            name: "未使用",
            data: [start],
          })
        } else {
          seriesData.push({
            id: 2,
            data: [start - sortData[index - 1].freqBand[1]],
          })
        }

        if (network === 1) {
          seriesData.push({
            name: "子网1使用",
            label: {
              show: true,
              formatter: start + "MHz-" + end + "MHz",
              fontSize: 15,
              fontWeight: "bolder",
            },
            data: [end - start],
          })
        } else if (network === 2) {
          seriesData.push({
            name: "子网2使用",
            label: {
              show: true,
              formatter: start + "MHz-" + end + "MHz",
              fontSize: 15,
              fontWeight: "bolder",
            },
            data: [end - start],
          })
        }
      })
      update({
        series: seriesData,
      })
    } catch (error) {
      console.log("parse error", error)
    }
  }, [])

  useEffect(() => {
    connectToWebsocket().then((res) => {
      res?.addEventListener("message", (ev) => {
        parseData(ev.data)
      })
    })
  }, [connectToWebsocket])

  return <div className="w-full h-full " ref={(dom) => (domRef.current = dom)}></div>
}

export default SpectrumBar
