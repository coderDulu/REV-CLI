import { useEffect, useState } from "react";
import ConnectDialog from "@/components/ConnectDialog";
import { useConnect } from "@/hooks/useConnect";
import { Space, Tag } from "antd";

function Connect() {
  const { isConnect } = useConnect();
  const [showModel, setShowModel] = useState(!isConnect);

  useEffect(() => {
    if(!isConnect) {
      setShowModel(true)
    }
  }, [isConnect])


  return (
    <Space className="app-noDrag">
      <button onClick={() => setShowModel(true)} className="bg-[#2fc5cf] h-8 flex items-center justify-center rounded-md px-4 py-2 text-white text-base">
        设备连接
      </button>
      {isConnect ? <Tag color="success">已连接</Tag> : <Tag color="error">未连接</Tag>}
      <ConnectDialog showModel={showModel} onHide={() => setShowModel(false)} />
    </Space>
  );
}

export default Connect;
