import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import useConnect from "@/hooks/useConnect"
import { useEffect } from "react"

const list = [
  {
    name: "管理端",
    value: "/manage",
  },
  {
    name: "中心端",
    value: "/center",
  },
  {
    name: "用户端",
    value: "/user",
  },
]

function HeaderTabs() {
  const navigate = useNavigate()
  const connect = useConnect() // 解构 role，避免重复访问 connect.role

  useEffect(() => {
    if (connect.role) {
      navigate(`/${connect.role}`)
    }
  }, [connect.role, navigate]) // 确保 navigate 也在依赖项中

  // 辅助函数：判断是否为当前角色
  const isActiveTab = (itemValue: string) => connect.role === itemValue.replace("/", "")

  return (
    <ul className="w-11/12 h-10 m-auto flex items-center gap-1 justify-center rounded-3xl bg-[#EDEDED]">
      {list.map((item) => (
        <li
          key={item.value}
          className={clsx(
            "flex flex-1 h-full app-noDrag rounded-3xl border-none items-center justify-center hover:opacity-50",
            {
              "bg-[#0d8383] text-white": isActiveTab(item.value), // 简化条件判断
              "cursor-not-allowed": !isActiveTab(item.value),
              "hidden": !isActiveTab(item.value),
            }
          )}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}

export default HeaderTabs
