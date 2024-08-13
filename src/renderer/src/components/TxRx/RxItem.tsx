import { Form, Input, Space } from "antd";
import TxRxContainer from "./TxRxContainer";
import { useEffect, useState } from "react";
import CButton from "../common/CButton";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";

function TxItem() {
  return (
    <TxRxContainer title="接收数据" borderColor="#F0B376" bgColor="#fff7ef">
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

function FormSet() {
  const [receiveData, setReceive] = useState("");

  const { connectToWebsocket } = useWebsocketConnect("text");

  useEffect(() => {
    connectToWebsocket().then((ws) => {
      if (ws) {
        ws.onmessage = (e) => {
          setReceive((preData) => preData + e.data);
        };
      }
    });
  }, [connectToWebsocket]);

  const onClear = () => {
    setReceive("")
  };

  return (
    <Form {...layout} initialValues={{ interval: 1000, isAuto: true }} name="control-hooks" style={{ maxWidth: 600 }}>
      <Form.Item label="已发送数据长度">{receiveData.length}</Form.Item>
      <Form.Item wrapperCol={{ offset: 2, span: 20 }} rules={rules}>
        <Input.TextArea value={receiveData} autoSize={{ minRows: 10, maxRows: 10 }} showCount></Input.TextArea>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space>
          <CButton type="button" buttonType="danger" onClick={onClear}>
            清零
          </CButton>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default TxItem;
