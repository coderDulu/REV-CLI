import { useEffect, useState } from "react"
import YaxisRangeSet from "./YaxisRangeSet"
import useEcharts from "@/hooks/useEcharts"

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
      rich: {
        down: {
          padding: [10, 0, 0, 0], // 向下偏移一点
          fontSize: 12,
          color: "#000", // 字体颜色可以根据需要调整
        },
      },
      // rotate: 30,
    },
    axisTick: {
      show: false,
    },
  },
  grid: {
    top: 10,
    // height: "90%",
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
          if (index === 0) {
            return `{down|Start ${value} MHz}` // 返回 rich 样式标记
          } else if (index === data.length - 1) {
            return `{down|Stop ${value} MHz}` // 返回 rich 样式标记
          } else if (valueToShow?.value >= limit) {
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

  // 设置y轴范围
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

export default BarOfSpectrum

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
