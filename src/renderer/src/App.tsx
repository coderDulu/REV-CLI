import { useEffect } from "react"
import Layout from "./components/layout/page"
import { message } from "antd"
import { TasksProvider } from "@/hooks/useConnect"
import { useNavigate, useLocation } from "react-router-dom"
import { AliveScope } from "react-activation"

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

    window.onerror = function (message) {
      console.error("捕获到错误:", message)
      // 可以选择显示友好的错误消息或记录错误
      return true // 防止错误信息显示在控制台
    }
  }, [])

  // 路由设置
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // 从 localStorage 获取上次访问的路由
    const lastRoute = localStorage.getItem("lastRoute")
    if (lastRoute) {
      navigate(lastRoute) // 跳转到上次访问的路由
    }
  }, [navigate])

  useEffect(() => {
    // 保存当前路由到 localStorage
    localStorage.setItem("lastRoute", location.pathname)
  }, [location.pathname]) // 只在路径变化时触发

  return (
    <TasksProvider>
      {contextHolder}
      <AliveScope>
        <Layout />
      </AliveScope>
    </TasksProvider>
  )
}

export default App
