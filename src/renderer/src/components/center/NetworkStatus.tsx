import { Flex } from "antd"
import TopologyOfNode from "../TopologyOfNode"
import NetWorkRate from "./NetWorkRate"

function NetworkStatus() {
  return (
    <Flex vertical className="w-full h-full pt-5 pr-5">
      <div className="flex-1 min-h-0">
        <TopologyOfNode />
      </div>
      <div className="flex-1 min-h-0">
        <NetWorkRate />
      </div>
    </Flex>
  )
}

export default NetworkStatus
