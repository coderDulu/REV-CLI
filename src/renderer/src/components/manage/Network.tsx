import TopologyOfManage from "../Topology"
import LineLeftItem from "../common/LineLeftItem"
import FreqFormConfig from "../FreqFormConfig"
import NetworkList from "./NetworkList"
import { useState } from "react"

function Network() {
  const [chooseNode, setChooseNode] = useState<string>("")
  return (
    <div className="flex w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-xl">{chooseNode}用频配置</h1>
        <FreqFormConfig node={chooseNode}/>
        <h1 className="font-bold text-xl">网络信息</h1>
        <NetworkList />
      </LineLeftItem>
      <div className="flex-1 p-2">
        <TopologyOfManage onNodeClick={(node) => {
          node.includes("子网") && setChooseNode(node.slice(0, 3))

        }} />
      </div>
    </div>
  )
}

export default Network
