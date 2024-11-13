import { Modal, Button, Form, Space, InputNumber } from "antd"
import type { FormProps } from "antd"
import IpInput from "./IpInput"

import { useConnect, useConnectDispatch } from "@/hooks/useConnect"
import { useListenMainEvent } from "@/hooks/useMainEvent"
import { useCallback, useEffect, useRef, useState } from "react"
type FieldType = {
  address: string
  port: number
}

interface Props {
  showModel: boolean
  onHide: () => void
}

function ConnectForm({ showModel, onHide }: Props) {
  const connect = useConnect()
  const connectDispatch = useConnectDispatch()
  const [isConnecting, setIsConnecting] = useState(false)
  const connectCacheRef = useRef(connect.isConnect)

  useEffect(() => {
    // connected => disconnected reload page
    if (connectCacheRef.current === true && connect.isConnect === false) {
      location.reload()
    }
    return () => {
      connectCacheRef.current = connect.isConnect
    }
  }, [connect.isConnect])

  const subscribe = useCallback((e, isClosed: boolean) => {
    if (isClosed) {
      connectDispatch({
        type: "update",
        isConnect: false,
      })
      setIsConnecting(false)
    }
  }, [])

  useListenMainEvent("ws-closed", subscribe)

  const onFinished: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      setIsConnecting(true)
      connectDispatch({
        type: "update",
        address: values.address,
        port: values.port,
      })

      const role = await window.electron.invoke("ws-connect", {
        address: values.address,
        port: values.port,
      })

      connectDispatch({
        type: "update",
        isConnect: true,
        role,
      })
      onHide()
      window.$message.success("连接成功")
      setIsConnecting(false)
    } catch (error) {
      handleWsClose()
    }
  }

  function handleWsClose() {
    window.$message.error("连接错误")
    connectDispatch({
      type: "update",
      isConnect: false,
    })
  }

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  async function handleDisconnect() {
    try {
      await window.electron.invoke("ws-disconnect")

      connectDispatch({
        type: "update",
        isConnect: false,
      })
      window.$message.success("断开连接成功")
      setIsConnecting(false)
    } catch (error) {
      console.log("disconnect", error)
    }
  }

  return (
    <Modal
      title="设备连接"
      footer={null}
      centered
      maskClosable={false}
      open={showModel}
      onCancel={onHide}
    >
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
        <Form.Item<FieldType> label="IP地址" name="address">
          <IpInput address={connect.address || ""} />
        </Form.Item>

        <Form.Item<FieldType>
          label="port"
          name="port"
          rules={[{ required: true, message: "请输入" }]}
        >
          <InputNumber min={0} max={65535} value={connect.port} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 16 }} className="m-4">
          <Space>
            <Button type="default" onClick={onHide}>
              取消
            </Button>
            <Button danger onClick={handleDisconnect}>
              断开连接
            </Button>
            <Button
              loading={isConnecting}
              className="bg-[#0d8383] w-20 h-8 rounded text-white"
              htmlType="submit"
            >
              连接
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ConnectForm
