import { Select } from "antd"
import { ids } from "@/hooks/useConnect"
import useConnect from "@/hooks/useConnect"
import { useEffect, useState } from "react"

const options = Object.keys(ids)
  .filter(Number)
  .map((key) => ({ label: ids[key], value: key }))

console.log("options", options)

function DestNode({ onChange, value }) {
  const [selectOptions, setSelectOptions] = useState(options)

  const { role } = useConnect()

  useEffect(() => {
    if (role) {
      const network = ids[role].slice(0, 3)
      const op = options.filter((item) => item.value !== role + "" && item.label.startsWith(network))
      setSelectOptions(op)
    }
  }, [role])

  return <Select options={selectOptions} onChange={onChange} value={value} />
}

export default DestNode
