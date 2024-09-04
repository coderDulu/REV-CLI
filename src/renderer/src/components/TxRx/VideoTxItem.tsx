import { Alert, Form, InputNumber, Upload, UploadProps } from "antd";
import TxRxContainer from "./TxRxContainer";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ActionButton from "@/components/common/ActionButtons";

function FileTxItem() {
  return (
    <TxRxContainer title="发送视频" borderColor="#0D8383" bgColor="#f3fbfc">
      <FileForm />
    </TxRxContainer>
  );
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

const rules = [{ required: true, message: "请输入内容" }];

function FileForm() {
  const [form] = Form.useForm();
  const [file, setFile] = useState<any>();
  // const { connectToWebsocket, sendMessage } = useWebsocketConnect("file");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    return () => {
      window.electron.invoke("stop-send-video");
    };
  }, []);

  const onFinish = async () => {
    if (file) {
      const { path } = file;
      window.electron.invoke("send-video", path);
      setIsSending(true);
    } else {
      window.$message.warning("请选择文件");
    }
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    accept: "video/*",
  };

  const onStop = () => {
    window.electron.invoke("stop-send-video");
    setIsSending(false);
    window.$message.success("已停止");
  };

  return (
    <Form form={form} {...layout} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item label="通信目的节点" name="network" rules={rules}>
        <InputNumber />
      </Form.Item>
      <Form.Item label="选择文件" rules={rules}>
        <Upload.Dragger name="files" {...props} maxCount={1}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或者拖动文件到此上传</p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item>{/* < */}</Form.Item>
      <Form.Item {...tailLayout}>
        <ActionButton isSending={isSending} onStop={onStop} />
      </Form.Item>
      {isSending && <Alert showIcon message="点击发送按钮后，跳转到其他页面或刷新都将停止发送" type="warning" />}

      
    </Form>
  );
}

export default FileTxItem;
