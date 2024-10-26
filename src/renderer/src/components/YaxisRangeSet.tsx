import React from "react"
import { Form, InputNumber, Button, Modal } from "antd"
import { RuleObject } from "rc-field-form/lib/interface"

interface RangeFormProps {
  onRangeSubmit: (values: { min: number; max: number }) => void
  visible: boolean
  onClose: () => void
}

const RangeForm: React.FC<RangeFormProps> = ({ onRangeSubmit, visible, onClose }) => {
  const [form] = Form.useForm()

  // 自定义校验规则，确保 min 小于 max
  const validateMin = (_: RuleObject, value: number) => {
    const max = form.getFieldValue("max")
    if (value >= max) {
      return Promise.reject(new Error("最小值必须小于最大值"))
    }
    return Promise.resolve()
  }

  const validateMax = (_: RuleObject, value: number) => {
    const min = form.getFieldValue("min")
    if (value <= min) {
      return Promise.reject(new Error("最大值必须大于最小值"))
    }
    return Promise.resolve()
  }

  const onFinish = (values: { min: number; max: number }) => {
    onRangeSubmit(values) // 将数据传递给父组件
  }

  return (
    <Modal
      title="设置Y轴显示范围"
      open={visible}
      onCancel={onClose}
      footer={null} // 表单内部有提交按钮，因此移除默认 footer
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        initialValues={{
          min: 0,
          max: 65536,
        }}
      >
        <Form.Item
          label="最小值"
          name="min"
          rules={[{ required: true, message: "请输入最小值" }, { validator: validateMin }]}
        >
          <InputNumber min={0} max={65536} />
        </Form.Item>

        <Form.Item
          label="最大值"
          name="max"
          rules={[{ required: true, message: "请输入最大值" }, { validator: validateMax }]}
        >
          <InputNumber min={0} max={65536} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RangeForm
