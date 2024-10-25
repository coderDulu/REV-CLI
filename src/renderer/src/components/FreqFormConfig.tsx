import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { Form, Select } from "antd"
import { useEffect, useCallback, useState } from "react"

interface Props {
  node: string
}

interface DataType {
  startFreq: number
  mode: 0 | 1 // 0 -> 自适应跳频，1 -> 频点固定模式
  bandSelect: number
}

// 频点options
const startFreqList = {
  230: [230, 390],
  240: [240, 400],
  250: [250, 410],
  260: [260, 420],
  270: [270, 430],
  280: [280, 440],
  290: [290, 450],
  300: [300, 460],
  310: [310, 470],
  320: [320, 480],
  330: [330, 490],
  340: [340, 500],
  350: [350, 510],
  360: [360, 520],
  370: [370, 530],
  380: [380, 540],
  390: [380, 550],
  400: [400, 560],
  410: [410, 570],
  420: [420, 580],
  430: [430, 590],
  440: [440, 600],
  450: [450, 610],
  460: [460, 620],
  470: [470, 630],
  480: [480, 640],
  490: [490, 650],
  500: [500, 660],
  510: [510, 670],
}
const startFreqOption = Object.keys(startFreqList).map((item) => ({
  label: +item,
  value: +item,
}))
// 频段options
const bandSelectOption = [
  { label: "自适应跳频", value: 0 },
  { label: "频点固定模式", value: 1 },
]
// 信道选择
const channelArr = Array(32)
  .fill("")
  .map((_, index: number) => index)
const channelOptions = channelArr.map((item) => ({
  label: item,
  value: item,
}))

function FreqFormConfig({ node }: Props) {
  const { connectToWebsocket: getWs, sendMessage: sendMessageOfGet } =
    useWebsocketConnect("freq-config-get")
  const { connectToWebsocket: setWs, sendMessage: sendMessageOfSet } =
    useWebsocketConnect("freq-config-set")
  const [form] = Form.useForm()

  const [network, setNetwork] = useState<number>()
  useEffect(() => {
    const id = node.at(2)
    if (id) {
      setNetwork(+id)
    }
  }, [node])

  const getFormData = useCallback(async () => {
    if (network !== undefined) {
      const res = await getWs()
      sendMessageOfGet(JSON.stringify({ network: network }))
      res?.addEventListener("message", (ev) => {
        try {
          const parseData = JSON.parse(ev.data) as DataType
          form.setFieldsValue(parseData)
        } catch (error) {
          console.log("network-info parse error")
        }
      })
    }
  }, [form, getWs, network, sendMessageOfGet])

  useEffect(() => {
    getFormData()
  }, [getFormData])

  useEffect(() => {
    setWs().then((res) => {
      res?.addEventListener("message", (ev) => {
        const data = JSON.parse(ev.data)
        if (data.result === "success") {
          window.$message.success("设置成功")
        } else {
          window.$message.error("设置失败")
        }
      })
    })
  }, [setWs])

  const onFinish = (values) => {
    if (!network) {
      window.$message.warning("请点击右侧，选择子网")
      return
    }
    const data = {
      ...values,
      network: network,
    }
    sendMessageOfSet(JSON.stringify(data))
  }

  const onFinishFailed = () => {}
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="mt-4"
      >
        <Form.Item<DataType> name="startFreq" label="起始频点">
          <Select className="!w-40" options={startFreqOption} />
        </Form.Item>
        <Form.Item<DataType> name="mode" label="频段模式">
          <Select className="!w-40" options={bandSelectOption} />
        </Form.Item>
        {/* 通道 */}
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => {
            return (
              <Form.Item label="通道" name="bandSelect">
                <Select
                  className="!w-40"
                  disabled={getFieldValue("mode") === 0}
                  options={channelOptions}
                />
              </Form.Item>
            )
          }}
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button
            className="rounded w-20 h-8 bg-[#0D8383] text-[#fff] border-[#0D8383] border"
            type="submit"
          >
            设置
          </button>
        </Form.Item>
      </Form>
    </>
  )
}

export default FreqFormConfig
