import {
  Space,
  Form,
  Select,
  Button,
  Table,
  TableProps,
  TimePicker,
  Modal,
  FormProps,
  Flex,
  Alert,
  Statistic,
} from "antd"
import { TableRowSelection } from "antd/es/table/interface"
import { useEffect, useRef, useState } from "react"
import { useImmerReducer } from "use-immer"
import dayjs from "dayjs"
import { nanoid } from "nanoid"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import duration from "dayjs/plugin/duration" // 引入 duration 插件

dayjs.extend(duration) // 使用插件

interface DataType {
  key?: React.Key
  network: 1 | 2
  startFreq: number
  mode: 0 | 1 // 0 -> 自适应跳频，1 -> 频点固定模式
  bandSelect: number

  // centerFreq: number;
  // bandwidth: number;
  // maxPower: number;
  startTime: any
  status: false
  // freqSelect: number;
  // spectrum: number;
}
// 将秒数转换为 HH:mm:ss 格式
const formatTime = (seconds) => {
  const duration = dayjs.duration(seconds * 1000) // 将秒转换为毫秒
  return dayjs().hour(0).minute(0).second(0).add(duration).format("HH:mm:ss")
}

function FreqPlan() {
  const { connectToWebsocket, sendMessage } = useWebsocketConnect("freq-plan")

  const [dataSource, dispatch] = useImmerReducer<DataType[], any>(
    reducer,
    JSON.parse(sessionStorage.getItem("table-data") ?? "[]")
  )
  const [selectRow, setSelectRow] = useState<React.Key[]>([])
  const [isSending, setIsSending] = useState(false)

  // 规划用时
  const [planTimer, setPlanTimer] = useState("00:00:00")

  useEffect(() => {
    connectToWebsocket()
  }, [connectToWebsocket])

  const selectData: DataType | undefined = dataSource.find((item) => item.key === selectRow?.at(-1))
  // 添加
  function handleConfirmAdd(data: DataType) {
    const key = nanoid()
    const hasExitData = dataSource.some(
      (item) => item.startTime === data.startTime && item.network === data.network
    )
    if (hasExitData) {
      window.$message.warning("该时间点已存在")
      return
    }
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

  // 发送
  const timer = useRef<any>(null)
  const startCount = useRef(0)
  useEffect(() => {
    return () => {
      if (timer.current) {
        handleStop()
      }
    }
  }, [])
  function handleSend() {
    const hasNeedSend = dataSource.some((item) => item.status === false)

    const dataSourceOfTimer = dataSource

    if (!hasNeedSend) {
      window.$message.warning("无规则需要下发")

      return
    }
    setIsSending(true)

    const executeLogic = (count) => {
      const newTimer = formatTime(count)
      setPlanTimer(newTimer)

      const index = dataSourceOfTimer.findIndex(
        (item) => item.startTime === newTimer && item.status === false
      )

      if (index !== -1) {
        const { network, startFreq, mode, bandSelect } = dataSourceOfTimer[index]
        sendMessage(
          JSON.stringify({
            network,
            startFreq,
            mode,
            bandSelect,
          })
        ).then(() => {
          dispatch({
            type: "update",
            payload: {
              ...dataSourceOfTimer[index],
              status: true,
            },
          })
        })

        if (index === dataSourceOfTimer.length - 1) {
          clearInterval(timer.current)
          window.$message.success("所有规则已下发")
          setIsSending(false)
        } else {
          window.$message.info(`第${index + 1}条规则下发成功`)
        }
      }
    }

    // 立即执行一次逻辑
    executeLogic(startCount.current)

    // 开启每秒执行的 interval
    timer.current = setInterval(() => {
      startCount.current++
      executeLogic(startCount.current)
    }, 1000)
  }
  // 停止发送
  function handleStop() {
    clearInterval(timer.current)
    setIsSending(false)
    window.$message.warning("已暂停发送")
  }

  function handleCancel() {
    clearInterval(timer.current)
    timer.current = null
    startCount.current = 0
    setIsSending(false)
    setPlanTimer("00:00:00")

    // 重置所有已发送配置状态
    const resetData = dataSource.map((item) => {
      return {
        ...item,
        status: false,
      }
    })
    dispatch({
      type: "replace",
      payload: resetData,
    })

    window.$message.warning("已结束发送")
  }

  // 监听数据变化
  const dataSourceRef = useRef(dataSource)
  useEffect(() => {
    dataSourceRef.current = dataSource // 更新 ref 的值
    sessionStorage.setItem("table-data", JSON.stringify(dataSourceRef.current))
  }, [dataSource])

  return (
    <Flex gap="middle" vertical className="w-full h-full pl-12 pt-12 gap-6 pr-12">
      <h2 className="font-bold text-2xl">用频规划</h2>
      <Statistic title="规划用时" value={planTimer} />
      <Space className="flex justify-end">
        <AddTablePlan text="编辑" title="编辑规划" onConfirm={handleEdit} initData={selectData} />
        <AddTablePlan text="新增" title="新增规划" onConfirm={handleConfirmAdd}></AddTablePlan>

        <Button danger onClick={handleDelete}>
          删除
        </Button>
      </Space>

      <TablePlan dataSource={dataSource} onSelect={handleSelect} />

      <Flex vertical gap={10}>
        <Alert
          showIcon
          message="规则如果正在定时下发中，跳转到其他页面或刷新都将停止发送"
          type="warning"
        />
      </Flex>
      <Space className="self-center">
        <Button
          onClick={handleSend}
          disabled={isSending}
          className="!w-36 !h-14 bg-[#0D8383] text-white rounded-md border-[#0D8383]"
        >
          开始
        </Button>
        <Button disabled={!isSending} danger className="!w-36 !h-14" onClick={handleStop}>
          暂停
        </Button>
        <Button type="default" className="!w-36 !h-14" onClick={handleCancel}>
          结束
        </Button>
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
    const { startTime } = values
    const formatStartTime = startTime.format("HH:mm:ss")

    if (initData) {
      values.key = initData.key
    }
    onConfirm({
      ...values,
      startTime: formatStartTime,
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
// 子网选择
const networkSelectOption = [
  { label: "子网络1", value: 1 },
  { label: "子网络2", value: 2 },
]

// 添加或编辑表单组件
function TableForm({ onFinish, onFinishFailed, initData }: TableFormProps) {
  const rules = [{ required: true, message: "请输入" }]

  const initFormData: DataType = {
    network: 1,
    startFreq: 230,
    mode: 0,
    bandSelect: 1,
    status: false,
    ...initData,
    startTime: dayjs(initData?.startTime ?? "00:00:00", "HH:mm:ss"),
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
        <Form.Item<DataType> name="network" label="子网选择">
          <Select className="!w-40" options={networkSelectOption} />
        </Form.Item>
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
              <Form.Item label="通信通道" name="bandSelect">
                <Select
                  className="!w-40"
                  disabled={getFieldValue("mode") === 0}
                  options={channelOptions}
                />
              </Form.Item>
            )
          }}
        </Form.Item>

        <Form.Item<DataType> label="配置时间" name="startTime" rules={rules}>
          <TimePicker className="w-40" />
        </Form.Item>

        <Form.Item rules={rules} shouldUpdate noStyle>
          {({ getFieldValue }) => {
            return (
              <Form.Item<DataType> name="status" label="配置状态">
                <span>{getFieldValue("status") || "未配置"}</span>
              </Form.Item>
            )
          }}
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
      title: "子网",
      dataIndex: "network",
      key: "network",
    },
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
      title: "通信通道",
      dataIndex: "bandSelect",
      key: "bandSelect",
    },
    {
      title: "配置时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "配置状态",
      dataIndex: "status",
      key: "status",
      render(value) {
        return <>{value ? "已配置" : "未配置"}</>
      },
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
