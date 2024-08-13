import { useEffect } from "react";
import Layout from "./components/layout/page";
import { message } from 'antd';
import { TasksProvider } from '@/hooks/useConnect';


function App() {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.$message = messageApi;
  }, [messageApi]);

  return (
    <TasksProvider>
      {contextHolder}
      <Layout />
    </TasksProvider>
  );
}

export default App;
