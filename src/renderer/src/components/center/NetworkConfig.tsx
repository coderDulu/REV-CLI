import LineLeftItem from "../common/LineLeftItem"
import FreqFormConfig from "@/components/FreqFormConfig"
import useConnect, { ids } from "@/hooks/useConnect"
import SpectrumItem from "@/components/SpectrumItem"

function NetworkConfig() {
  const { role } = useConnect()

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-2xl">业务信道参数</h1>
        <FreqFormConfig node={ids[role]} />
      </LineLeftItem>
      <div className="flex flex-col gap-10 min-w-0 p-4">
        <SpectrumItem network={ids[role]?.at(2)}/>
        {/* <div className="flex-[1] min-h-0 min-w-0">
          <SpectrumStatus />
        </div>
        <div className="flex-[2] min-w-0 min-h-0">
          <NetworkRate />
        </div> */}
      </div>
    </div>
  )
}

export default NetworkConfig
