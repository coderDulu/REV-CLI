import { Form, InputNumber, Upload, UploadFile, UploadProps } from "antd";
import TxRxContainer from "./TxRxContainer";
import CButton from "../common/CButton";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { readFileInChunks } from "@/utils/blob";

function FileTxItem() {
  return (
    <TxRxContainer title="发送文件" borderColor="#0D8383" bgColor="#f3fbfc">
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
  const [file, setFile] = useState<UploadFile>();
  const { connectToWebsocket, sendMessage } = useWebsocketConnect("file");

  useEffect(() => {
    connectToWebsocket();
  }, [connectToWebsocket]);

  const onFinish = async () => {
    if (file) {
      const { name, size, type, path } = file;
      await sendMessage(
        JSON.stringify({
          name,
          size,
          type,
        })
      );

      window.electron.invoke("send-video", path);
      // console.log(file);
      // readFileInChunks(
      //   file,
      //   1024 * 1024,
      //   (chunk) => {
      //     // console.log(chunk);
      //     sendMessage(chunk);
      //   },
      //   (err) => {
      //     console.log("err", err);
      //   }
      // );
      // sendMessage(fileList[0] as any);
    }
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
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
        <CButton buttonType="primary" type="submit">
          发送
        </CButton>
      </Form.Item>
    </Form>
  );
}

export default FileTxItem;
