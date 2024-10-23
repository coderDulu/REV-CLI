import { useEffect, useState } from "react"
import TopologyOfManage from "../Topology"
import LineLeftItem from "../common/LineLeftItem"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"

function Network() {
  const { connectToWebsocket } = useWebsocketConnect("network-info")
  const [formData, setFormData] = useState<{
    freq_bane: string
    freq_mode: number | undefined
    channel: string
  }>({
    freq_bane: "",
    freq_mode: undefined,
    channel: "",
  })

  useEffect(() => {
    connectToWebsocket().then(res => {
      res?.addEventListener("message", (ev) => {
        console.log(ev.data);
        try {
          const parseData: any = JSON.parse(ev.data)
          setFormData(parseData)
        } catch (error) {
          console.log('network-info parse error');
        }
      })
    })
  }, [connectToWebsocket])

  return (
    <div className="flex w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-2xl">网络信息</h1>
        <ul className="mt-4 flex flex-col gap-6">
          <li>当前工作频段： {formData.freq_bane}</li>
          <li>工作模式：{formData.freq_mode === 0 ? "自适应跳频" : "频点固定模式"}</li>
          <li>通信通道：{formData.channel}</li>
        </ul>
      </LineLeftItem>
      <div className="flex-1 p-2">
        <TopologyOfManage />
      </div>
    </div>
  )
}

export default Network
