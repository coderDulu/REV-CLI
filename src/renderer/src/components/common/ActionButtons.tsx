import { Space } from "antd";
import CButton from "./CButton";

interface ActionButtonsProps {
  isSending: boolean;
  onStop: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isSending, onStop, onClear }) => {
  return (
    <Space>
      <CButton disabled={isSending} type="submit" buttonType="primary">
        发送
      </CButton>
      <CButton disabled={!isSending} type="button" onClick={onStop}>
        停止
      </CButton>
      <CButton type="button" buttonType="danger" onClick={onClear}>
        重置
      </CButton>
    </Space>
  );
};

export default ActionButtons;