import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useEffect, useState } from "react"

interface DataType {
  network: number;
  freqBand: number[];
  mode: number;
  bandSelect: number;
  freq: number;
}

function NetworkList() {
  const { connectToWebsocket } = useWebsocketConnect("network-info")
  const [list, setList] = useState<DataType[]>([])

  useEffect(() => {
    connectToWebsocket().then((socket) => {
      socket?.addEventListener("message", (ev) => {
        const data = JSON.parse(ev.data) as DataType[]
        setList(data)
      })
    })
  }, [connectToWebsocket])

  return (
    <>
      {list.map((item) => {
        return (
          <ul key={item.network} className="mt-5 flex flex-col gap-2">
            <li>子网：{item.network}</li>
            <li>工作频段：{item.freqBand[0]}MHz ~ {item.freqBand[1]}MHz</li>
            <li>工作模式：{item.mode === 0 ? "自适应跳频" : "频点固定"}</li>
            <li>通信通道：{item.bandSelect}</li>
            <li>通信频点：{item.freq}MHz</li>
          </ul>
        )
      })}
    </>
  )
}

export default NetworkList
