import { Space } from "antd";
import CButton from "./CButton";

interface ActionButtonsProps {
  isSending: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  submitText?: string;
  stopText?: string;
  clearText?: string;
  sendingText?: string;
  [key: string]: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSending, sendingText = "正在发送", onStart, onStop, onReset, submitText = "发送", stopText, clearText, ...args }) => {
  return (
    <Space {...args}>
      <CButton disabled={isSending} type="submit" buttonType="primary" onClick={onStart}>
        {isSending ? sendingText : submitText}
      </CButton>
      <CButton disabled={!isSending} type="button" onClick={onStop}>
        {stopText ? stopText : "停止"}
      </CButton>
      {onReset && (
        <CButton type="button" buttonType="danger" onClick={onReset}>
          {clearText ? clearText : "重置"}
        </CButton>
      )}
    </Space>
  );
};

export default ActionButtons;
