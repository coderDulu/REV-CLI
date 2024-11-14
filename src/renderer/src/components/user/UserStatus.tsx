import useConnect, { ids } from "@/hooks/useConnect"
import SpectrumItem from "../SpectrumItem"
import { Result } from "antd"

function UserStatus() {
  const { role } = useConnect()

  try {
    return (
      <div className="p-4 w-full h-full ">
        <SpectrumItem network={ids[role]?.at(2)} />
      </div>
    )
  } catch (error) {
    return <Result status="404" title="404" subTitle="当前页面出现错误，请稍后重试。" />
  }
}

export default UserStatus
