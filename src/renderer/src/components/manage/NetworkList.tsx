import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useEffect, useState } from "react"

interface DataType {
  network: number
  freqBand: number[]
  mode: number
  bandSelect: number
  freq: number
}

function NetworkList() {

  const [list, setList] = useState<DataType[]>([])

  const eventFn = (message: string) => {
    try {
      const data = JSON.parse(message) as DataType[]
      // 使用 Map 去重，基于 id 属性
      const uniqueArr = Array.from(new Map(data.map((item) => [item.network, item])).values())
      setList(uniqueArr)
    } catch (error) {
      console.log(error)
    }
  }
  const { connectToWebsocket } = useWebsocketConnect("manage-network-info", eventFn)

  useEffect(() => {
    connectToWebsocket()
  }, [connectToWebsocket])

  return (
    <>
      {list.map((item, index) => {
        return (
          <ul key={index} className="mt-5 flex flex-col gap-2">
            <li>子网：{item.network}</li>
            <li>
              工作频段：{item.freqBand[0]}MHz ~ {item.freqBand[1]}MHz
            </li>
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
