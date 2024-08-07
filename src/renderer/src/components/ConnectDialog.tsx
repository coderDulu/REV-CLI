
import { Modal, Button, Checkbox, Form, Input, Space } from 'antd';
import type { FormProps } from 'antd';
import IpInput from './IpInput';

interface Props {
  showModel: boolean
  onHide: () => void
}

function ConnectDialog({ showModel, onHide }: Props) {


  return (
    <>
      <Modal title="设备连接" footer={null} centered maskClosable={false} open={showModel} onCancel={onHide}>
        <ConnectForm />
      </Modal>
    </>
  );
}


function ConnectForm() {
  type FieldType = {
    address?: string;
    port?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return <>
    {/* <IpInput value='127.0.0.1' /> */}
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="IP地址"
        name="address"
        rules={[{ required: true, message: '请输入' }]}
      >
        <IpInput address='127.0.0.1' onChange={(ip) => console.log("ip", ip)} />
      </Form.Item>

      <Form.Item<FieldType>
        label="port"
        name="port"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
        <Space>
          <Button type="default">
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            连接
          </Button>

        </Space>
      </Form.Item>
    </Form>
  </>
}

export default ConnectDialog;