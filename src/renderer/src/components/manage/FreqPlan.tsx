import {
  Radio,
  Space,
  Form,
  Select,
  Button,
  Table,
  TableProps,
  TimePicker,
  Modal,
  FormProps,
  InputNumber,
  Flex,
  Alert,
} from "antd"
import { TableRowSelection } from "antd/es/table/interface"
import { useEffect, useState } from "react"
import { useImmerReducer } from "use-immer"
import dayjs from "dayjs"
import { nanoid } from "nanoid"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import CButton from "../common/CButton"
import { FormConfig } from "../center/NetworkConfig"

interface DataType {
  key?: React.Key
  startFreq: string
  mode: 0 | 1 // 0 -> 自适应跳频，1 -> 频点固定模式
  bandSelect: number

  // centerFreq: number;
  // bandwidth: number;
  // maxPower: number;
  startTime: any
  endTime: any
  // freqSelect: number;
  // spectrum: number;
}

const initFormData = Array(0)
  .fill(0)
  .map((_: number, index: number) => {
    const key = nanoid()
    return {
      key: key,
      centerFreq: index,
      bandwidth: 30,
      maxPower: 30,
      startTime: "00:00:00",
      endTime: "00:00:01",
      freqSelect: 1,
      spectrum: 1,
    }
  })

function getInitData() {
  const lastData = sessionStorage.getItem("table-data")
  if (lastData) {
    const parseData = JSON.parse(lastData)
    return parseData.data
  }
  return initFormData
}

function FreqPlan() {
  const { connectToWebsocket, close, sendMessage } = useWebsocketConnect("freq-plan")
  const [network, setNetwork] = useState(1)
  const [interval, setInterVal] = useState(1000)

  const [dataSource, dispatch] = useImmerReducer<DataType[], any>(reducer, getInitData())
  const [selectRow, setSelectRow] = useState<React.Key[]>([])
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    connectToWebsocket()
    return () => {
      close()
    }
  }, [close, connectToWebsocket])

  useEffect(() => {
    const saveData = {
      // network: network,
      data: dataSource,
    }
    sessionStorage.setItem("table-data", JSON.stringify(saveData))
  }, [dataSource])

  const selectData: DataType | undefined = dataSource.find((item) => item.key === selectRow?.at(-1))
  // 添加
  function handleConfirmAdd(data: DataType) {
    const key = nanoid()
    dispatch({
      type: "add",
      payload: {
        key,
        ...data,
      },
    })
  }

  // 选择
  function handleSelect(selected: React.Key[]) {
    setSelectRow(selected)
  }

  // 编辑
  function handleEdit(data: DataType) {
    dispatch({
      type: "update",
      payload: data,
    })
  }

  // 删除
  function handleDelete() {
    dispatch({ type: "delete", payload: selectRow })
    setSelectRow([])
  }

  function handleSend() {
    if (selectRow.length) {
      const sendData = selectRow.map((select) => dataSource.find((item) => select === item.key))
      sendData.forEach((rule) => {
        sendPlan(JSON.stringify(rule))
      })
      window.$message.success("下发成功")
    } else {
      setIsSending(true)
      window.$message.warning("开始发送")
      dataSource.forEach((item, index) => {
        intervalSendPlan(item.startTime, item.endTime, JSON.stringify(item), index + 1)
      })
    }
  }

  // 发送数据
  function sendPlan(data: string) {
    try {
      return sendMessage(data)
    } catch (error) {
      console.log("send message error", error)
    }
  }

  // 根据时间下发规则,如果没有选择row
  const intervalSendPlan = (startTime: number, endTime: number, data: string, index: number) => {
    let timer: any = null

    // 1. 获取当前时间
    const nowDate = new Date().toLocaleDateString().replace(/\//g, "-")

    // 2. 时间戳获取
    const _startTime = new Date(`${nowDate} ${startTime}`).getTime()
    const _endTime = new Date(`${nowDate} ${endTime}`).getTime()

    // 3. 定时发送
    if (_startTime === _endTime) {
      sendPlan(data)
    } else {
      timer = setInterval(() => {
        console.log(Date.now() > _startTime)
        if (Date.now() > _startTime) {
          sendPlan(data)
            ?.then(() => {
              window.$message.success(`规则${index}已下发`)
              if (index === dataSource.length) {
                window.$message.success("所有规则已下发")
                setIsSending(false)
              }
            })
            .catch(() => {
              window.$message.error(`规则${index}发送失败，请检查连接`)
            })

          clearInterval(timer)
        }
        setIsSending((lastStatus) => {
          if (!lastStatus) {
            clearInterval(timer)
          }
          return lastStatus
        })
      }, 1000)
    }
  }

  function handleCancel() {
    setIsSending(false)
    window.$message.success("暂停发送")
  }

  return (
    <Flex gap="middle" vertical className="w-full h-full pl-12 pt-12 gap-6 pr-12">
      <h2 className="font-bold text-2xl">用频规划</h2>

      <Space align="center">
        {/* <Radio.Group onChange={(e) => setNetwork(e.target.value)} value={network}> */}
        {/* <Radio value={1}>子网络1</Radio> */}
        {/* <Radio value={2}>子网络2</Radio> */}
        {/* </Radio.Group> */}

        <div>
          <span className="text-sm">发送间隔：</span>
          <Select
            defaultValue={interval}
            style={{ width: 120 }}
            onChange={(value) => setInterVal(value)}
            options={[
              { value: 500, label: "500ms" },
              { value: 1000, label: "1s" },
              { value: 1500, label: "1.5s" },
              { value: 2000, label: "2s" },
            ]}
          />
        </div>
      </Space>

      <Space>
        <AddTablePlan text="编辑" title="编辑规划" onConfirm={handleEdit} initData={selectData} />
        <AddTablePlan text="新增" title="新增规划" onConfirm={handleConfirmAdd}></AddTablePlan>

        {/* <Button>导出</Button>
        <Button>导入</Button> */}
        <Button danger onClick={handleDelete}>
          删除
        </Button>
      </Space>

      <TablePlan dataSource={dataSource} onSelect={handleSelect} />

      <Flex vertical gap={10}>
        <Alert
          showIcon
          message="选择行点击下发按钮将会立即下发规则，否则会根据时间按时下发规则"
          type="warning"
        />
        <Alert
          showIcon
          message="规则如果正在定时下发中，跳转到其他页面或刷新都将停止发送"
          type="warning"
        />
      </Flex>
      <Space className="self-center">
        {!isSending ? (
          <CButton
            onClick={handleSend}
            className="!w-36 !h-14 bg-[#0D8383] text-white rounded-md border-[#0D8383]"
          >
            规划下发
          </CButton>
        ) : (
          <CButton buttonType="danger" className="!w-36 !h-14" onClick={handleCancel}>
            暂停
          </CButton>
        )}
      </Space>
    </Flex>
  )
}

// 添加表单
interface AddTablePlanProps {
  onConfirm: (data: DataType) => void
  text: string
  title: string
  initData?: DataType
}

// 新增或编辑组件
function AddTablePlan({ onConfirm, text, title, initData }: AddTablePlanProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = (values) => {
    const { startTime, endTime } = values
    const formatStartTime = startTime.format("HH:mm:ss")
    const formatEndTime = endTime.format("HH:mm:ss")

    if (initData) {
      values.key = initData.key
    }
    onConfirm({
      ...values,
      startTime: formatStartTime,
      endTime: formatEndTime,
    })
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={showModal}>{text}</Button>
      <Modal
        destroyOnClose
        centered
        title={title}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <TableForm initData={initData} onFinish={onFinish} />
        {/* <FormConfig onFinish={onFinish} /> */}
      </Modal>
    </>
  )
}

interface TableFormProps {
  onFinish?: FormProps<DataType>["onFinish"]
  onFinishFailed?: FormProps<DataType>["onFinishFailed"]
  initData?: DataType
}

// 信道选择
const channelArr = Array(32)
  .fill("")
  .map((_, index: number) => index)
const channelOptions = channelArr.map((item) => ({
  label: item,
  value: item,
}))
// 频点options
const startFreqList = {
  230: ["230", "390"],
  240: ["240", "400"],
  250: ["250", "410"],
  260: ["260", "420"],
  270: ["270", "430"],
  280: ["280", "440"],
  290: ["290", "450"],
  300: ["300", "460"],
  310: ["310", "470"],
  320: ["320", "480"],
  330: ["330", "490"],
  340: ["340", "500"],
  350: ["350", "510"],
  360: ["360", "520"],
  370: ["370", "530"],
  380: ["380", "540"],
  390: ["380", "550"],
  400: ["400", "560"],
  410: ["410", "570"],
  420: ["420", "580"],
  430: ["430", "590"],
  440: ["440", "600"],
  450: ["450", "610"],
  460: ["460", "620"],
  470: ["470", "630"],
  480: ["480", "640"],
  490: ["490", "650"],
  500: ["500", "660"],
  510: ["510", "670"],
}
const startFreqOption = Object.keys(startFreqList).map((item) => ({
  label: item,
  value: item,
}))
// 频段options
const bandSelectOption = [
  { label: "自适应跳频", value: 0 },
  { label: "频点固定模式", value: 1 },
]

// 添加或编辑表单组件
function TableForm({ onFinish, onFinishFailed, initData }: TableFormProps) {
  const rules = [{ required: true, message: "请输入" }]
  const initFormData: DataType = {
    startFreq: "230",
    mode: 0,
    bandSelect: 1,
    ...initData,
    startTime: dayjs(initData?.startTime ?? "00:00:00", "HH:mm:ss"),
    endTime: dayjs(initData?.endTime ?? "00:00:01", "HH:mm:ss"),
  }

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={initFormData}
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
                  disabled={getFieldValue("autoChannel")}
                  options={channelOptions}
                />
              </Form.Item>
            )
          }}
        </Form.Item>

        <Form.Item<DataType> label="起始时间" name="startTime" rules={rules}>
          <TimePicker className="w-40" />
        </Form.Item>

        <Form.Item<DataType>
          label="结束时间"
          name="endTime"
          rules={[
            ...rules,
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startTime = getFieldValue("startTime")
                if (startTime.isBefore(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(new Error("结束时间不应早于起始时间"))
                }
              },
            }),
          ]}
        >
          <TimePicker className="w-40" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <button className="rounded w-20 h-8 text-[#0D8383] border-[#0D8383] border" type="submit">
            确定
          </button>
        </Form.Item>
      </Form>
    </>
  )
}

function NumberInput(props) {
  return <InputNumber {...props} className="w-40" />
}

// 表格组件
function TablePlan({
  dataSource,
  onSelect,
}: {
  dataSource: DataType[]
  onSelect: (data: React.Key[]) => void
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    onSelect(newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  }

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "起始频点(MHz)",
      dataIndex: "startFreq",
      key: "startFreq",
    },
    {
      title: "模式",
      dataIndex: "mode",
      key: "mode",
      render(value) {
        return bandSelectOption.find((item) => item.value === value)?.label
      },
    },
    {
      title: "通道",
      dataIndex: "bandSelect",
      key: "bandSelect",
    },
    {
      title: "起始时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
    },
  ]

  return (
    <>
      <Table
        pagination={{ pageSize: 7, showSizeChanger: false }}
        rowSelection={rowSelection}
        className="mt-10 mb-20 h-80"
        dataSource={dataSource}
        columns={columns}
      />
    </>
  )
}
function reducer(draft: DataType[], action: any) {
  switch (action.type) {
    case "add": {
      draft.push(action.payload)
      return draft
    }
    case "delete": {
      const delArr: React.Key[] = action.payload
      const newArr = draft.filter((item) => !delArr.includes(item.key ?? ""))

      return newArr
    }
    case "update": {
      const key = action.payload.key
      const updateIndex = draft.findIndex((item) => item.key === key)
      draft[updateIndex] = action.payload
      return draft
    }
    case "replace": {
      draft = action.payload
      return draft
    }
  }
}

export default FreqPlan
