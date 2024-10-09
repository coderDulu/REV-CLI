// 自主选频
import { useEffect } from "react"
import Topology from "../Topology"
import { useHeatmap } from "@/hooks/useHeatmap"
import useWebSocketConnect from "@/hooks/useWebsocketConnect"

function AutoFreq() {
  const { heatmapEcharts, update } = useHeatmap()
  const { connectToWebsocket, close, websocketRef } = useWebSocketConnect("network-freq-status")

  useEffect(() => {
    connectToWebsocket()
    return () => {
      close()
    }
  }, [close, connectToWebsocket])

  useEffect(() => {
    const cache = []

    heatmapEcharts.myChart.current?.setOption({
      series: [{ data: [] }],
    })

    function parseData(ev) {
      try {
        const parseData: any = JSON.parse(ev.data)
        const { start_freq, freq_status, field_num } = parseData
        update(freq_status, start_freq, cache, field_num)
      } catch (error) {
        console.log(error)
      }
    }

    const ws = websocketRef.current

    ws?.addEventListener("message", parseData)

    return () => {
      ws?.removeEventListener("message", parseData)
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <div className="flex-1">
          <Topology exclude={[0]} />
        </div>
        <div className="flex-1" ref={(dom) => (heatmapEcharts.domRef.current = dom)}></div>
      </div>
      {/* <div className="flex-1">
        <ChannelUse chooseNode={chooseNode}/>
      </div> */}
    </div>
  )
}

export default AutoFreq
