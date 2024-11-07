/**
 * 频谱使用状态(多个子网使用)
 */
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
      fontSize: 18,
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
    // {
    //   name: "未使用",
    //   type: "bar",
    //   stack: "total",
    //   label: {
    //     show: false,
    //   },
    //   emphasis: {
    //     focus: "series",
    //   },
    //   data: [0],
    // },
    // {
    //   name: "冲突",
    //   type: "bar",
    //   stack: "total",
    //   label: {
    //     show: false,
    //   },
    //   emphasis: {
    //     focus: "series",
    //   },
    //   data: [0],
    //   itemStyle: {
    //     color: "#ee6666",
    //   },
    // },
    // {
    //   name: "未使用",
    //   type: "bar",
    //   stack: "total",
    //   label: {
    //     show: false,
    //   },
    //   emphasis: {
    //     focus: "series",
    //   },
    //   data: [],
    // },
  ],
  animation: true,
  animationDurationUpdate: 100,
}

const NoUseOption = {
  name: "未使用",
  type: "bar",
  stack: "total",
  label: {
    show: false,
  },
  emphasis: {
    focus: "series",
  },
  data: [0],
}
const conflictOption = {
  name: "冲突",
  type: "bar",
  stack: "total",
  label: {
    show: false,
  },
  emphasis: {
    focus: "series",
  },
  data: [0],
  itemStyle: {
    color: "#ee6666",
  },
}
const generateNetworkOption = function (name: string, start: number, end: number) {
  return {
    type: "bar",
    name: name,
    label: {
      show: true,
      formatter: `${start}MHz-${end}MHz`,
      fontSize: 15,
      fontWeight: "bolder",
    },
    stack: "total",
    data: [end - start], // 子网1的值
  }
}

function SpectrumBar() {
  const { connectToWebsocket } = useWebsocketConnect("manage-network-info")
  const { domRef, update } = useECharts(option)

  const parseData = useCallback((data) => {
    try {
      const parse = JSON.parse(data) as DataType
      const seriesData: any[] = [
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
      ]
      // 使用 Map 去重，基于 id 属性
      const uniqueArr = Array.from(new Map(parse.map((item) => [item.network, item])).values())
      const sortData = uniqueArr.sort((a, b) => a.freqBand[0] - b.freqBand[0])

      // 子网1添加
      const newOption = generateNetworkOption(
        `子网${sortData[0].network}使用`,
        sortData[0].freqBand[0],
        sortData[0].freqBand[1]
      )
      seriesData.push(newOption)

      // 冲突/未使用/子网2添加
      if (sortData.length === 2) {
        const conflict = sortData[0].freqBand[1] - sortData[1].freqBand[0]
        if (conflict && conflict > 0) {
          seriesData.push({
            ...conflictOption,
            data: [conflict],
          })
        } else {
          seriesData.push({ ...conflictOption })
        }

        // 子网1和子网2之间的间隔
        seriesData.push({
          ...NoUseOption,
          data: [sortData[1].freqBand[0] - sortData[0].freqBand[1]],
        })

        // 子网2添加
        const newOption2 = generateNetworkOption(
          `子网${sortData[1].network}使用`,
          sortData[1].freqBand[0],
          sortData[1].freqBand[1]
        )
        seriesData.push(newOption2)

        // 其余未使用
        seriesData.push({
          ...NoUseOption,
          data: [endFreq - sortData[1].freqBand[1]],
        })
      } else {
        // 其余未使用
        seriesData.push({
          ...NoUseOption,
          data: [endFreq - sortData[0].freqBand[1]],
        })
      }

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
