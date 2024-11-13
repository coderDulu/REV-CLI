/**
 * 节点感知状态
 */

import useEcharts from "@/hooks/useEcharts"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useCallback, useEffect } from "react"
import { useImmer } from "use-immer"
import YaxisRangeSet from "./YaxisRangeSet"

const initOption = {
  title: {
    text: "设备感知状态",
    // top: 10,
    left: 40,
    textStyle: {
      fontSize: 18,
      color: "#000",
    },
  },
  xAxis: {
    type: "category",
    data: [],
    axisLabel: {
      show: true,
      rich: {
        down: {
          padding: [12, 0, 0, 0], // 向下偏移一点
          fontSize: 12,
          // color: "#000", // 字体颜色可以根据需要调整
        },
      },
      formatter() {
        return ""
      },
    },
    axisTick: {
      show: false,
    },
  },
  tooltip: {
    trigger: "axis",
    // axisPointer: {
    //   type: "shadow",
    // },
    formatter(value) {
      return `频点: ${(+value[0].axisValueLabel).toFixed(3)}MHz <br/> 能量: ${value[0].value}dBm`
    },
  },
  yAxis: {
    name: "能量(dBm)",
    type: "value",
    min: 0,
    max: 65536,
  },
  series: [
    {
      data: [],
      type: "bar",
      animation: false,
    },
  ],
  animation: false,
}
function NodeBar({ node, option = {} }: { node?: string; xLength?: number; option?: object }) {
  const { connectToWebsocket, message } = useWebsocketConnect("network-bar")
  const [data, setData] = useImmer([])

  useEffect(() => {
    try {
      setData(JSON.parse(message))
    } catch (error) {
      console.warn('network-bar error', error);
    }
  }, [message, setData])

  useEffect(() => {
    connectToWebsocket()
  }, [connectToWebsocket])

  const { domRef, update, myChart } = useEcharts({
    ...initOption,
  })

  useEffect(() => {
    myChart.current?.on("click", (params) => {
      console.log("params", params)
    })
  }, [myChart])

  // useEffect(() => {
  //   const chart = myChart.current
  //   if (chart) {
  //     chart.on("mouseover", (params) => {
  //       if (params.componentType === "series") {
  //         // 动态设置标签显示
  //         chart.setOption({
  //           xAxis: {
  //             axisLabel: {
  //               formatter: (value, index) => {
  //                 if (index === 0) {
  //                   return `{down|Start ${value} MHz}` // 返回 rich 样式标记
  //                 } else if (index === 1023) {
  //                   return `{down|Stop ${value} MHz}` // 返回 rich 样式标记
  //                 } else if (index === params.dataIndex) {
  //                   return index === params.dataIndex ? value + "MHz" : ""
  //                 }
  //                 return ""
  //               },
  //             },
  //           },
  //         })
  //       }
  //     })
  //   }
  // }, [myChart])

  useEffect(() => {
    update({
      ...option,
    })
  }, [option, update])

  // 修改title
  useEffect(() => {
    if (node) {
      update({
        title: {
          text: `节点${node}设备感知状态`,
        },
      })
    }
  }, [node, update])

  // 更新data
  useEffect(() => {
    update({
      series: [
        {
          data: data,
        },
      ],
    })
  }, [data, update])

  const [show, setShow] = useImmer(false)

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

export default NodeBar
