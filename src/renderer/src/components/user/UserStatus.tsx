import useConnect, {ids} from "@/hooks/useConnect"
import SpectrumItem from "../SpectrumItem"

function UserStatus() {
  const { role } = useConnect()
  return (
    <div className="p-4 w-full h-full ">
      <SpectrumItem network={ids[role].at(2)} />
    </div>
  )
}

export default UserStatus
