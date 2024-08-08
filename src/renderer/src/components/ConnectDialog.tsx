
import { Modal, Button, Form, Space, InputNumber } from 'antd';
import type { FormProps } from 'antd';
import IpInput from './IpInput';

import useWebsocket from '@/hooks/useWebsocket';
import { useConnect, useConnectDispatch } from '@/hooks/useConnect';

type FieldType = {
  address: string;
  port: number;
};

interface Props {
  showModel: boolean
  onHide: () => void
  onFinish: (args: FieldType) => void
}

function ConnectForm({ showModel, onHide, onFinish }: Props) {
  const socket = useWebsocket()
  const connect = useConnect()
  const connectDispatch = useConnectDispatch()

  const onFinished: FormProps<FieldType>['onFinish'] = async (values) => {
    onFinish(values)
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function handleDisconnect() {
    socket.close()

    connectDispatch({
      type: "update",
      isConnect: false
    })
    window.$message.success("断开连接成功")
  }

  return <Modal title="设备连接" footer={null} centered maskClosable={false} open={showModel} onCancel={onHide}>
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ address: connect.address, port: connect.port }}

      onFinish={onFinished}
      onFinishFailed={onFinishFailed}
      autoComplete="off"

    >
      <Form.Item<FieldType>
        label="IP地址"
        name="address"
      >
        <IpInput address={connect.address || ""} />
      </Form.Item>

      <Form.Item<FieldType>
        label="port"
        name="port"
        rules={[{ required: true, message: '请输入' }]}
      >
        <InputNumber min={0} max={65535} value={connect.port} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 10, span: 16 }} className='m-4'>
        <Space>
          <Button type="default" onClick={onHide}>
            取消
          </Button>
          <Button danger onClick={handleDisconnect} >
            断开连接
          </Button>
          <button className='bg-[#0d8383] w-20 h-8 rounded text-white' type="submit">
            连接
          </button>
        </Space>
      </Form.Item>
    </Form>
  </Modal>
}

export default ConnectForm;