/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"
import { useImmerReducer } from "use-immer"

interface Connect {
  address: string
  port: number
  isConnect: boolean
  role?: number
}
export enum ids {
  "管理端" = 0,
  "子网1中心端" = 4,
  "子网1用户端A" = 5,
  "子网1用户端B" = 6,
  "子网2中心端" = 8,
  "子网2用户端A" = 9,
  "子网2用户端B" = 10,
}

const storage = sessionStorage.getItem("connect")
const initialTasks: Connect = storage
  ? JSON.parse(storage)
  : {
      address: "127.0.0.1",
      port: 8080,
      isConnect: false,
    }

const TasksContext = createContext<Connect>(initialTasks)

const TasksDispatchContext = createContext<any>(null)

export default useConnect

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks)

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  )
}

export function useConnect() {
  return useContext(TasksContext)
}

export function useConnectDispatch() {
  return useContext(TasksDispatchContext)
}

interface ActionType {
  type: string
  address?: string
  port?: number
  isConnect?: boolean
  role?: number
}
function tasksReducer(tasks: Connect, action: ActionType) {
  const { type, ...data } = action
  switch (type) {
    case "update": {
      Object.assign(tasks, data)
      // 存储数据到sessionStorage
      sessionStorage.setItem("connect", JSON.stringify(tasks))
      return tasks
    }
    default: {
      throw Error("Unknown action: " + type)
    }
  }
}
