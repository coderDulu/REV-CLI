import { Divider } from "antd";
import Topology from "../Topology";

function Network() {
  // const { message, connect, close: wsClose } = useWebsocket();
  // const connectInfo = useConnect();

  // useEffect(() => {
  //   const { isConnect, address, port } = connectInfo;
  //   if (isConnect) {
  //     const url = `ws://${address}:${port}/topology`;
  //     connect(url);
  //   } else {
  //     wsClose();
  //   }
  // }, [connect, connectInfo, wsClose]);

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col gap-6 w-96 p-10 m-4">
        <h1 className="font-bold text-2xl">网络列表</h1>
        <ul className="flex flex-col gap-6">
          <li>网络节点数目： 未选择</li>
          <li>当前工作频段： -10MHz-150MHz</li>
        </ul>
      </div>
      <Divider type="vertical" className="h-full" />
      <div className="flex-1 p-2">
        <Topology />
      </div>
    </div>
  );
}

export default Network;
