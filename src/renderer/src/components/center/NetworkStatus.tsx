import { Flex } from "antd";
import NodeBar from "../NodeBar";
import Topology from "../Topology";
import { useState } from "react";

function NetworkStatus() {
  const [chooseNode, setChooseNode] = useState("");

  return (
    <Flex vertical className="w-full h-full">
      <div className="flex-1">
        <Topology exclude={[0]} tips="点击节点显示其频谱能量分布" onNodeClick={(choose) => setChooseNode(choose)} />
      </div>
      <div className="flex-1">
        <NodeBar node={chooseNode} />
      </div>
    </Flex>
  );
}

export default NetworkStatus;
