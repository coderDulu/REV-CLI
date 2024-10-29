import { Select } from "antd"
import { ids } from "@/hooks/useConnect"
import useConnect from "@/hooks/useConnect"
import { useEffect, useState } from "react"

const options = Object.keys(ids)
  .filter(Number)
  .map((key) => ({ label: ids[key], value: key }))

function DestNode({ onChange, value }) {
  const [selectOptions, setSelectOptions] = useState(options)

  const { role } = useConnect()

  useEffect(() => {
    const op = options.filter((item) => item.value !== role + "")
    setSelectOptions(op)
  }, [role])

  return <Select options={selectOptions} onChange={onChange} value={value} />
}

export default DestNode
