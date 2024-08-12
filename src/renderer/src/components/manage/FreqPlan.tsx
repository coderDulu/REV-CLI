import { Radio, Space, Form, Select, Button, Table, TableProps, TimePicker, Modal, FormProps, InputNumber, Flex } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useImmerReducer } from "use-immer";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

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

const initFormData = Array(1000)
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
  const [network, setNetwork] = useState(1);
  const [interval, setInterVal] = useState(1000);

  const [dataSource, dispatch] = useImmerReducer<DataType[], any>(reducer, getInitData());
  const [selectRow, setSelectRow] = useState<number>(0);

  useEffect(() => {
    const saveData = {
      network: network,
      data: dataSource,
    };
    sessionStorage.setItem("table-data", JSON.stringify(saveData));
  }, [dataSource, network]);

  const selectData: DataType | undefined = dataSource.find((item) => item.key === selectRow);
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

  function handleSelect(selected: React.Key[]) {
    setSelectRow(selected[0] as number);
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
    dispatch({ type: "delete", payload: selectData?.key });
  }

  return (
    <Flex gap="middle" vertical className="w-full h-full pl-12 pt-12 gap-6 pr-12">
      <h2 className="font-bold text-2xl"> 用频规划</h2>

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

      <button className="w-36 h-14 self-center bg-[#0D8383] text-white rounded-md border-[#0D8383]">规划下发</button>
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
    type: "radio",
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
      <Table pagination={{ pageSize: 7, showSizeChanger: false }} rowSelection={rowSelection} className="mt-10 mb-20 h-96" dataSource={dataSource} columns={columns} />
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
      const delIndex = draft.findIndex((item) => item.key === action.payload);
      draft.splice(delIndex, 1);
      return draft;
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
