import { Radio, Space, Form, Select, Button, Table, TableProps, TimePicker, Modal, FormProps, InputNumber, Flex, Alert } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import CButton from "../common/CButton";

interface DataType {
  key?: React.Key;
  centerFreq: number;
  bandwidth: number;
  maxPower: number;
  startTime: any;
  endTime: any;
  freqSelect: number;
  spectrum: number;
}

const initFormData = Array(0)
  .fill(0)
  .map((_: number, index: number) => {
    const key = nanoid();
    return {
      key: key,
      centerFreq: index,
      bandwidth: 30,
      maxPower: 30,
      startTime: "00:00:00",
      endTime: "00:00:01",
      freqSelect: 1,
      spectrum: 1,
    };
  });

function getInitData() {
  const lastData = sessionStorage.getItem("table-data");
  if (lastData) {
    const parseData = JSON.parse(lastData);
    return parseData.data;
  }
  return initFormData;
}

function FreqPlan() {
  const { connectToWebsocket, close, sendMessage } = useWebsocketConnect("freq-plan");
  const [network, setNetwork] = useState(1);
  const [interval, setInterVal] = useState(1000);

  const [dataSource, dispatch] = useImmerReducer<DataType[], any>(reducer, getInitData());
  const [selectRow, setSelectRow] = useState<React.Key[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    connectToWebsocket();
    return () => {
      close();
    };
  }, [close, connectToWebsocket]);

  useEffect(() => {
    const saveData = {
      network: network,
      data: dataSource,
    };
    sessionStorage.setItem("table-data", JSON.stringify(saveData));
  }, [dataSource, network]);

  const selectData: DataType | undefined = dataSource.find((item) => item.key === selectRow?.at(-1));
  // 添加
  function handleConfirmAdd(data: DataType) {
    const key = nanoid();
    dispatch({
      type: "add",
      payload: {
        key,
        ...data,
      },
    });
  }

  // 选择
  function handleSelect(selected: React.Key[]) {
    setSelectRow(selected);
  }

  // 编辑
  function handleEdit(data: DataType) {
    dispatch({
      type: "update",
      payload: data,
    });
  }

  // 删除
  function handleDelete() {
    dispatch({ type: "delete", payload: selectRow });
  }

  function handleSend() {
    if (selectRow.length) {
      const sendData = selectRow.map((select) => dataSource.find((item) => select === item.key));
      sendPlan(JSON.stringify(sendData));
      window.$message.success("下发成功");
    } else {
      setIsSending(true);
      window.$message.warning("开始发送");
      dataSource.forEach((item, index) => {
        intervalSendPlan(item.startTime, item.endTime, JSON.stringify(item), index + 1);
      });
    }
  }

  // 发送数据
  function sendPlan(data: string) {
    try {
      return sendMessage(data);
    } catch (error) {
      console.log("send message error", error);
    }
  }

  // 根据时间下发规则,如果没有选择row
  const intervalSendPlan = (startTime: number, endTime: number, data: string, index: number) => {
    let timer: any = null;

    // 1. 获取当前时间
    const nowDate = new Date().toLocaleDateString().replace(/\//g, "-");

    // 2. 时间戳获取
    const _startTime = new Date(`${nowDate} ${startTime}`).getTime();
    const _endTime = new Date(`${nowDate} ${endTime}`).getTime();

    // 3. 定时发送
    if (_startTime === _endTime) {
      sendPlan(data);
    } else {
      timer = setInterval(() => {
        console.log(Date.now() > _startTime);
        if (Date.now() > _startTime) {
          sendPlan(data)
            ?.then(() => {
              window.$message.success(`规则${index}已下发`);
            })
            .catch(() => {
              window.$message.error(`规则${index}发送失败，请检查连接`);
            });

          clearInterval(timer);
        }
        setIsSending((lastStatus) => {
          if (!lastStatus) {
            clearInterval(timer);
          }
          return lastStatus;
        });
      }, 1000);
    }
  };

  return (
    <Flex gap="middle" vertical className="w-full h-full pl-12 pt-12 gap-6 pr-12">
      <h2 className="font-bold text-2xl">用频规划</h2>

      <Space align="center">
        <Radio.Group onChange={(e) => setNetwork(e.target.value)} value={network}>
          <Radio value={1}>子网络1</Radio>
          <Radio value={2}>子网络2</Radio>
        </Radio.Group>

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
        <Alert showIcon message="选择行点击下发按钮将会立即下发规则，否则会根据时间按时下发规则" type="warning" />
        <Alert showIcon message="规则如果正在定时下发中，跳转到其他页面或刷新都将停止发送" type="warning" />
      </Flex>
      <Space className="self-center">
        {!isSending ? (
          <CButton onClick={handleSend} className="!w-36 !h-14 bg-[#0D8383] text-white rounded-md border-[#0D8383]">
            规划下发
          </CButton>
        ) : (
          <CButton buttonType="danger" className="!w-36 !h-14" onClick={() => setIsSending(false)}>
            暂停
          </CButton>
        )}
      </Space>
    </Flex>
  );
}

// 添加表单
interface AddTablePlanProps {
  onConfirm: (data: DataType) => void;
  text: string;
  title: string;
  initData?: DataType;
}

// 新增或编辑组件
function AddTablePlan({ onConfirm, text, title, initData }: AddTablePlanProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish: FormProps<DataType>["onFinish"] = (values) => {
    const { startTime, endTime } = values;
    const formatStartTime = startTime.format("HH:mm:ss");
    const formatEndTime = endTime.format("HH:mm:ss");

    if (initData) {
      values.key = initData.key;
    }
    onConfirm({
      ...values,
      startTime: formatStartTime,
      endTime: formatEndTime,
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>{text}</Button>
      <Modal destroyOnClose centered title={title} footer={null} open={isModalOpen} onCancel={handleCancel}>
        <TableForm initData={initData} onFinish={onFinish} />
      </Modal>
    </>
  );
}

interface TableFormProps {
  onFinish?: FormProps<DataType>["onFinish"];
  onFinishFailed?: FormProps<DataType>["onFinishFailed"];
  initData?: DataType;
}
// 添加或编辑表单组件
function TableForm({ onFinish, onFinishFailed, initData }: TableFormProps) {
  const rules = [{ required: true, message: "请输入" }];

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          centerFreq: 400,
          bandwidth: 160,
          maxPower: 30,
          freqSelect: 1,
          spectrum: 1,
          ...initData,
          startTime: dayjs(initData?.startTime ?? "00:00:00", "HH:mm:ss"),
          endTime: dayjs(initData?.endTime ?? "00:00:01", "HH:mm:ss"),
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="mt-4">
        <Form.Item<DataType> label="中心频点(MHz)" name="centerFreq" rules={rules}>
          <NumberInput />
        </Form.Item>

        <Form.Item<DataType> label="可用带宽(MHz)" name="bandwidth" rules={rules}>
          <NumberInput />
        </Form.Item>

        <Form.Item<DataType> label="最大发送功率(dBm)" name="maxPower" rules={rules}>
          <NumberInput />
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
                const startTime = getFieldValue("startTime");
                if (startTime.isBefore(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(new Error("结束时间不应早于起始时间"));
                }
              },
            }),
          ]}>
          <TimePicker className="w-40" />
        </Form.Item>

        <Form.Item<DataType> label="自主选频" name="freqSelect" rules={rules}>
          <NumberInput />
        </Form.Item>

        <Form.Item<DataType> label="频谱聚合" name="spectrum" rules={rules}>
          <NumberInput />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
          <button className="rounded w-20 h-8 text-[#0D8383] border-[#0D8383] border" type="submit">
            确定
          </button>
        </Form.Item>
      </Form>
    </>
  );
}

function NumberInput(props) {
  return <InputNumber {...props} className="w-40" />;
}

// 表格组件
function TablePlan({ dataSource, onSelect }: { dataSource: DataType[]; onSelect: (data: React.Key[]) => void }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    onSelect(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: "checkbox",
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "中心频点(MHz)",
      dataIndex: "centerFreq",
      key: "centerFreq",
    },
    {
      title: "可用带宽(MHz)",
      dataIndex: "bandwidth",
      key: "bandwidth",
    },
    {
      title: "最大功率(dBm)",
      dataIndex: "maxPower",
      key: "maxPower",
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
    {
      title: "自主选频",
      dataIndex: "freqSelect",
      key: "freqSelect",
    },
    {
      title: "频谱聚合",
      dataIndex: "spectrum",
    },
  ];

  return (
    <>
      <Table pagination={{ pageSize: 7, showSizeChanger: false }} rowSelection={rowSelection} className="mt-10 mb-20 h-80" dataSource={dataSource} columns={columns} />
    </>
  );
}
function reducer(draft: DataType[], action: any) {
  switch (action.type) {
    case "add": {
      draft.push(action.payload);
      return draft;
    }
    case "delete": {
      const delArr: string[] = action.payload;
      const newArr = draft.filter((item) => !delArr.includes(item.key));

      return newArr;
    }
    case "update": {
      const key = action.payload.key;
      const updateIndex = draft.findIndex((item) => item.key === key);
      draft[updateIndex] = action.payload;
      return draft;
    }
    case "replace": {
      draft = action.payload;
      return draft;
    }
  }
}

export default FreqPlan;
