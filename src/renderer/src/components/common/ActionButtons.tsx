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
  [key: string]: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSending, onStart, onStop, onReset, submitText, stopText, clearText, ...args }) => {
  return (
    <Space {...args}>
      <CButton disabled={isSending} type="submit" buttonType="primary" onClick={onStart}>
        {submitText ? submitText : "发送"}
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
