import Topology from "../Topology";
import LineLeftItem from "../common/LineLeftItem";

function Network() {
  return (
    <div className="flex w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-2xl">网络列表</h1>
        <ul className="flex flex-col gap-6">
          <li>网络节点数目： 未选择</li>
          <li>当前工作频段： -10MHz-150MHz</li>
        </ul>
      </LineLeftItem>
      <div className="flex-1 p-2">
        <Topology />
      </div>
    </div>
  );
}

export default Network;
