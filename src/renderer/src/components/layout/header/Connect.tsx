import { useState } from 'react'
import ConnectDialog from "@/components/ConnectDialog";

function Connect() {
  const [showModel, setShowModel] = useState(false)
  return <>
    <button onClick={() => setShowModel(true)} className="bg-[#2fc5cf] h-8 flex items-center justify-center rounded-md px-4 py-2 text-white text-base">设备连接</button>
    <ConnectDialog showModel={showModel} onHide={() => setShowModel(false)} />
  </>
}

export default Connect
