import LineLeftItem from "../common/LineLeftItem"
import FreqFormConfig from "@/components/FreqFormConfig"
import useConnect, { ids } from "@/hooks/useConnect"
import SpectrumItem from "@/components/SpectrumItem"
import NetworkList from "../manage/NetworkList"
import KeepAlive from "react-activation"

function NetworkConfig() {
  const { role } = useConnect()

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-2xl">业务信道参数</h1>
        <FreqFormConfig node={ids[role]} />
        <NetworkList />
      </LineLeftItem>
      <div className="flex flex-col gap-10 min-w-0 p-4">
        <KeepAlive id="center-spec">
          <SpectrumItem network={ids[role]?.at(2)} />
        </KeepAlive>
      </div>
    </div>
  )
}

export default NetworkConfig
