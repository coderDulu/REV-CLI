import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import useConnect from "@/hooks/useConnect"
import { useEffect, useState } from "react"
import { ids } from "@/hooks/useConnect"

const list = [
  {
    name: "管理端",
    value: "/manage",
    role: ["0"],
  },
  {
    name: "中心端",
    value: "/center",
    role: ["4", "8"],
  },
  {
    name: "用户端",
    value: "/user",
    role: ["5", "6", "9", "10"],
  },
]

function HeaderTabs() {
  const navigate = useNavigate()
  const connect = useConnect() // 解构 role，避免重复访问 connect.role

  const [tabName, setName] = useState("")

  useEffect(() => {
    if (connect.role) {
      setName(ids[connect.role])
      const lastRoute = localStorage.getItem("lastRoute")
      if (lastRoute) {
        navigate(lastRoute)
      }
    }
  }, [connect, navigate])

  return (
    <ul className="w-11/12 h-10 m-auto flex items-center gap-1 justify-center rounded-3xl bg-[#EDEDED]">
      <li
        className={clsx(
          "flex flex-1 h-full app-noDrag rounded-3xl border-none items-center justify-center hover:opacity-50",
          {
            "bg-[#0d8383] text-white": true, // 简化条件判断
          }
        )}
      >
        {tabName}
      </li>
    </ul>
  )
}

export default HeaderTabs
