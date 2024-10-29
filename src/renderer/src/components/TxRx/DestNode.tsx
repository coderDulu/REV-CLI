import { Select } from "antd";
import { ids } from "@/hooks/useConnect";

const options = Object.keys(ids).filter(Number).map((key) => ({label: ids[key], value: key}))
console.log('options', options, Object.keys(ids).filter(Number));
function DestNode() {
  return  <Select options={options}></Select>;
}

export default DestNode;