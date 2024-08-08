import { useRef, useState, forwardRef, LegacyRef } from 'react';
import { InputNumber, InputNumberProps, Space } from 'antd';

interface Props {
  address: string
  onChange?: (ip: string) => void
}

const IpInput = ({ address = "0.0.0.0", onChange }: Props) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [ip, setIp] = useState(address.split('.'))
  const ip1 = getIpSplit(0)
  const ip2 = getIpSplit(1)
  const ip3 = getIpSplit(2)
  const ip4 = getIpSplit(3)

  function getIpSplit(index: number) {
    const ipArr = ip

    return Number(ipArr[index])
  }

  function setIpSplit(text: string | number | null, index: number) {
    if (text !== null) {

      ip[index] = text + ''

      if (ip[index].length === 3) {
        inputRefs.current[index + 1]?.focus()
      }
      setIp(ip)

      const newIpStr = ip.join('.')
      onChange && onChange(newIpStr)
    }
  }

  function addRef(index: number, el: HTMLInputElement | null) {
    if (el) {
      inputRefs.current[index] = el
    }
  }

  return (
    <Space>
      <IpNumber defaultValue={ip1} ref={el => addRef(0, el)} onChange={e => setIpSplit(e, 0)} />
      .
      <IpNumber defaultValue={ip2} ref={el => addRef(1, el)} onChange={e => setIpSplit(e, 1)} />
      .
      <IpNumber defaultValue={ip3} ref={el => addRef(2, el)} onChange={e => setIpSplit(e, 2)} />
      .
      <IpNumber defaultValue={ip4} ref={el => addRef(3, el)} onChange={e => setIpSplit(e, 3)} />
    </Space>
  );
};

const IpNumber = forwardRef((props: InputNumberProps, ref: LegacyRef<HTMLInputElement> | undefined) => {

  return <InputNumber
    max={255}
    ref={ref}
    controls={false}
    maxLength={3}
    {...props}
    className='w-16'
  />
})


export default IpInput;
