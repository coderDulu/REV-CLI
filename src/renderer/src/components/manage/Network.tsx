import TopologyOfNode from "../TopologyOfNode"
import LineLeftItem from "../common/LineLeftItem"
import FreqFormConfig from "../FreqFormConfig"
import NetworkList from "./NetworkList"
import SpectrumBar from "../SpectrumBar"

import { useEffect, useRef, useState } from "react"

function Network() {
  const [chooseNode, setChooseNode] = useState<string>("")
  const [lastChooseNode, setLastNode] = useState("")

  useEffect(() => {
    return () => {
      setLastNode(chooseNode)
    }
  }, [chooseNode])
  return (
    <div className="flex w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-xl">{lastChooseNode}用频配置</h1>
        <FreqFormConfig node={chooseNode} />
        <h1 className="font-bold text-xl">网络信息</h1>
        <NetworkList />
      </LineLeftItem>
      <div className="flex-1 p-2 flex flex-col gap-4 min-w-0">
        <div className="h-[200px] min-w-0">
          <SpectrumBar />
        </div>
        <TopologyOfNode
          onNodeClick={(node) => {
            node.includes("子网") && setChooseNode(node.slice(0, 3))
            setTimeout(() => {
              setChooseNode("")
            }, 500)
          }}
        />
      </div>
    </div>
  )
}

export default Network
