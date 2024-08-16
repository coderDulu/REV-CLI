import { Form, InputNumber, Select, Switch } from "antd";
import LineLeftItem from "../common/LineLeftItem";
import CForm from "../common/CForm";
import CButton from "../common/CButton";
import useWebsocketConnect from "@/hooks/useWebsocketConnect";
import { useEffect } from "react";
import SpectrumStatus from "../SpectrumStatus";
import NetworkRate from "./NetWorkRate";

function NetworkConfig() {
  const { connectToWebsocket, sendMessage } = useWebsocketConnect("net-config");

  useEffect(() => {
    connectToWebsocket();
  }, [connectToWebsocket]);

  const onFinish = async (values: FormValues) => {
    try {
      sendMessage(JSON.stringify(values));
      window.$message.success("下发成功");
    } catch (error) {
      window.$message.error("下发失败");
    }
  };

  const onFinishFailed = () => {};

  return (
    <div className="grid grid-cols-[auto_1fr] w-full h-full">
      <LineLeftItem>
        <h1 className="font-bold text-2xl">业务信道参数</h1>
        <FormConfig onFinish={onFinish} onFinishFailed={onFinishFailed} />
      </LineLeftItem>
      <div className="flex flex-col gap-10 min-w-0">
        <div className="flex-[1] min-h-0 min-w-0">
          <SpectrumStatus />
        </div>
        <div className="flex-[2] min-w-0 min-h-0">
          <NetworkRate />
        </div>
      </div>
    </div>
  );
}

// 发送功率范围
const txPowerArr = Array(6)
  .fill("")
  .map((_, index: number) => (index - 1) * 5);
const txPowerOption = txPowerArr.map((item) => {
  return {
    label: item + " dBm",
    value: item,
  };
});

// 信道选择
const channelArr = Array(8)
  .fill("")
  .map((_, index: number) => index);
const channelOptions = channelArr.map((item) => ({
  label: item,
  value: item,
}));

interface FormValues {
  startFreq: number;
  channelBand: number;
  power: number;
  jamThread: number;
  autoChannel: boolean;
  autoChannelModel: boolean;
  fixFreqMode: boolean;
  bandSelect: number;
  chnSelect: number;
  freqChannel: number;
}

function FormConfig({ onFinish, onFinishFailed }) {
  const [form] = Form.useForm();

  const handleSwitchChange = (changedSwitch) => {
    const switches = form.getFieldsValue(["autoChannel", "autoChannelModel", "fixFreqMode"]);
    const updatedSwitches = {
      autoChannel: false,
      autoChannelModel: false,
      fixFreqMode: false,
      [changedSwitch]: switches[changedSwitch],
    };
    form.setFieldsValue(updatedSwitches);
  };

  return (
    <CForm
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      initialValues={{
        startFreq: 160,
        channelBand: 160,
        power: 0,
        jamThread: 10,
        autoChannel: true,
        autoChannelModel: false,
        fixFreqMode: false,
        bandSelect: 1,
        chnSelect: 0,
        freqChannel: 1,
      }}>
      <Form.Item name="startFreq" label="起始频点">
        <InputNumber className="w-40" suffix="MHz" />
        {/* <span className="ml-1">MHz</span> */}
      </Form.Item>
      <Form.Item name="channelBand" label="信道带宽">
        <Select className="!w-40" options={[{ value: 160, label: "160 MHz" }]} />
      </Form.Item>
      <Form.Item name="power" label="发射功率">
        <Select className="!w-40" options={txPowerOption} />
      </Form.Item>
      <Form.Item name="jamThread" label="干扰门限">
        <InputNumber className="w-40" suffix="MHz" />
      </Form.Item>
      <Form.Item name="autoChannel" label="自适应调频" valuePropName="checked">
        <Switch onChange={() => handleSwitchChange("autoChannel")} />
      </Form.Item>
      <Form.Item name="autoChannelModel" label="自适应调频" valuePropName="checked">
        <Switch onChange={() => handleSwitchChange("autoChannelModel")} />
      </Form.Item>
      <Form.Item name="fixFreqMode" label="频点固定模式" valuePropName="checked">
        <Switch onChange={() => handleSwitchChange("fixFreqMode")} />
      </Form.Item>
      <Form.Item name="freqChannel" label="通道选择">
        <Select className="!w-40" options={channelOptions} />
      </Form.Item>
      <Form.Item name="bandSelect" label="通道">
        <Select className="!w-40" options={channelOptions} />
      </Form.Item>
      <Form.Item name="chnSelect" label="通带">
        <Select className="!w-40" options={channelOptions} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8 }}>
        <CButton buttonType="primary" type="submit">
          设置
        </CButton>
      </Form.Item>
    </CForm>
  );
}

export default NetworkConfig;
