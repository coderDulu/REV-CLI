import useEcharts from "@/hooks/useEcharts"
import { useEffect } from "react"
import { useImmer } from "use-immer"

const initOption = {
  title: {
    text: "频段能量分布",
    // top: 10,
    left: 40,
    textStyle: {
      fontSize: 24,
      color: "#000",
    },
  },
  xAxis: {
    type: "category",
    data: Array(1024)
      .fill(0)
      .map((item, index) => index),
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  yAxis: {
    name: "能量(dBm)",
    type: "value",
    min: 0,
  },
  series: [
    {
      data: [],
      type: "bar",
      large: true,
      // animation: false,
      //  sampling: 'lttb'
    },
  ],
}
function NodeBar({ node, data }: { node?: string; data: number[] }) {
  const { domRef, update } = useEcharts(initOption)

  useEffect(() => {
    if (node) {
      update({
        title: {
          text: `节点${node}频段能量分布`,
        },
        xAxis: {
          data: Array(Number(32))
            .fill(0)
            .map((_, index) => index),
        },
      })
    }
  }, [node])

  useEffect(() => {
    update({
      series: [
        {
          data: data,
        },
      ],
    })
  }, [data])

  return <div className="w-full h-full" ref={(dom) => (domRef.current = dom)}></div>
}

export default NodeBar
