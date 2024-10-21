import { useEffect } from "react"
import Layout from "./components/layout/page"
import { message } from "antd"
import { TasksProvider } from "@/hooks/useConnect"

function App() {
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    window.$message = messageApi
  }, [messageApi])

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      // 检查是否按下 F12
      if (event.key === "F12") {
        // 向主进程发送消息，要求打开开发者工具
        window.electron.send("toggle-dev-tools")
      }
    })
  }, [])

  return (
    <TasksProvider>
      {contextHolder}
      <Layout />
    </TasksProvider>
  )
}

export default App
