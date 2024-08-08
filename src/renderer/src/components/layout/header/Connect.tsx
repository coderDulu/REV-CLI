import { useState } from 'react'
import ConnectDialog from "@/components/ConnectDialog";
import { useConnect, useConnectDispatch } from '@/hooks/useConnect'
import { Tag } from 'antd';
import useWebsocket from '@/hooks/useWebsocket';

function Connect() {
  const { isConnect } = useConnect()
  const connectDispatch = useConnectDispatch()
  const socket = useWebsocket()
  const [showModel, setShowModel] = useState(!isConnect)

  function handleConnect(values: { address: string, port: number }) {
    socket.connect(`ws://${values.address}:${values.port}`, (err) => {
      if (err) {
        window.$message.error("连接错误")
        connectDispatch({
          type: "update",
          isConnect: false
        })
        return
      }

      connectDispatch({
        type: "update",
        address: values.address,
        port: values.port,
        isConnect: true
      })
      setShowModel(false)

      window.$message.success("连接成功")
    })
  }

  return <>
    <button onClick={() => setShowModel(true)} className="bg-[#2fc5cf] h-8 flex items-center justify-center rounded-md px-4 py-2 text-white text-base">
      设备连接
    </button>
    {isConnect ? <Tag color="success">已连接</Tag> : <Tag color="error">未连接</Tag>}
    <ConnectDialog showModel={showModel} onHide={() => setShowModel(false)} onFinish={handleConnect} />
  </>
}

export default Connect
