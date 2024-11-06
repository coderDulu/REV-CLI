// 自主选频
import SpectrumStatus from "@/components/SpectrumStatus"
import NodeBar from "../NodeBar"
import { useImmer } from "use-immer"
import { useCallback } from "react"
import KeepAlive from "react-activation"

function AutoFreq() {
  const [option, setOption] = useImmer<any>({})

  const handleFreqChanged = useCallback(
    (band: number[]) => {
      if (band.length === 2) {
        const startFreq = band[0] ?? ""
        const endFreq = band[1] ?? ""
        const xData = generateSegments(startFreq, endFreq, 1023)
        const xAxis = {
          data: xData,
          axisLabel: {
            show: true,
            interval: 0,
            formatter(value, index) {
              if (index === 0) {
                return `{down|Start ${startFreq} MHz}` // 返回 rich 样式标记
              } else if (index === xData.length - 1) {
                return `{down|Stop ${endFreq} MHz}` // 返回 rich 样式标记
              }
              return ""
            },
          },
        }
        setOption((draft) => {
          draft.xAxis = xAxis
        })
      }
    },
    [setOption]
  )
  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className="h-48">
        <SpectrumStatus onFreqChange={handleFreqChanged} />
      </div>
      <div className="flex-[2]">
        <KeepAlive id="center-nodebar">
          <NodeBar option={option} />
        </KeepAlive>
      </div>
    </div>
  )
}

export default AutoFreq

/**
 * 将范围内的数分成segments份
 * @param start 开始值
 * @param end 结束值
 * @param segments 分段数
 * @returns
 */
function generateSegments(start: number, end: number, segments: number) {
  const step = (end - start) / segments
  return Array.from({ length: segments + 1 }, (_, i) => start + i * step)
}
