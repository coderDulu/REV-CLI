import TopologyNode from "../TopologyOfNode"
import SpectrumStatus from "../SpectrumStatus"
import NetWorkRate from "../center/NetWorkRate"

function NodeStatus() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-1/2 flex items-center">
        <TopologyNode />
        <div className="h-40 w-full">
          <SpectrumStatus />
        </div>
      </div>
      <div className="w-full h-1/2">
        <NetWorkRate />
      </div>
    </div>
  )
}

export default NodeStatus
