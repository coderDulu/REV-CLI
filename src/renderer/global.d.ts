import { MessageInstance } from 'antd/es/message/interface'
declare global {
  interface Window {
    $message: MessageInstance;
  }
}
export {}