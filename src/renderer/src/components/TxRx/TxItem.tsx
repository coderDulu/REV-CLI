import { Form, FormProps, Input, InputNumber, Select, Switch } from "antd";
import TxRxContainer from "./TxRxContainer";
import { useEffect, useRef, useState } from "react";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import ActionButtons from "../common/ActionButtons";

function TxItem() {
  return (
    <TxRxContainer title="发送数据" borderColor="#0D8383" bgColor="#f3fbfc">
      <FormSet />
    </TxRxContainer>
  );
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const rules = [{ required: true, message: "请输入内容" }];

interface FormDataType {
  network: number;
  interval: number;
  data: string;
  isAuto: boolean;
}
function FormSet() {
  const [form] = Form.useForm();
  const [sendDataLen, setSendDataLen] = useState(0);
  const { sendMessage, connectToWebsocket } = useWebsocketConnect("text");
  const [isSending, setIsSending] = useState(false);
  const sendDataTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    connectToWebsocket();
    return () => {
      sendDataTimer.current && clearInterval(sendDataTimer.current);
    };
  }, []);

  const onFinish: FormProps<FormDataType>["onFinish"] = (values) => {
    sendInterval(values);
  };

  function sendInterval(values: FormDataType) {
    try {
      const { interval, isAuto, data: sendData } = values;

      if (isAuto) {
        setIsSending((sending) => {
          if (!sending) {
            window.$message.success("发送成功");
            return true;
          }
          return sending;
        });
        sendDataTimer.current = setInterval(() => {
          send(sendData)
            .catch(() => {
              onStop();
            })
            .then(() => {
              setSendDataLen((sendDataLen) => sendDataLen + sendData.length);
            });
        }, interval);
      } else {
        send(sendData);
        setSendDataLen(sendDataLen + sendData.length);
        window.$message.success({
          content: "发送成功",
          duration: 1
        });
      }
    } catch (error) {
      window.$message.error("发送失败");
    }
  }

  async function send(sendData: string) {
    try {
      await sendMessage(sendData);
    } catch (err) {
      window.$message.error("发送失败");
      setIsSending(false);
      throw err;
    }
  }

  const onStop = () => {
    sendDataTimer.current && clearInterval(sendDataTimer.current);
    setIsSending(false);
    window.$message.warning("已停止");
  };

  const onClear = () => {
    onStop();
    setSendDataLen(0);
    form.resetFields(["data"]);
  };

  return (
    <Form form={form} {...layout} initialValues={{ interval: 1000, isAuto: true }} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item name="network" label="通信目的节点" rules={rules}>
        <InputNumber />
      </Form.Item>
      <Form.Item name="interval" label="数据发送间隔" rules={rules}>
        <Select placeholder="请选择" allowClear>
          <Select.Option value={100}>100ms</Select.Option>
          <Select.Option value={500}>500ms</Select.Option>
          <Select.Option value={1000}>1s</Select.Option>
          <Select.Option value={2000}>2s</Select.Option>
          <Select.Option value={5000}>5s</Select.Option>
          <Select.Option value={10000}>10s</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="isAuto" label="自动发送">
        <Switch></Switch>
      </Form.Item>
      <Form.Item label="已发送数据长度">{sendDataLen}</Form.Item>
      <Form.Item name="data" wrapperCol={{ offset: 4, span: 16 }} rules={rules}>
        <Input.TextArea autoSize={{ minRows: 6, maxRows: 6 }} showCount></Input.TextArea>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <ActionButtons isSending={isSending} onStop={onStop} onClear={onClear} />
      </Form.Item>
    </Form>
  );
}

export default TxItem;
