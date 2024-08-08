/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useImmerReducer } from 'use-immer'

interface Connect {
  address: string
  port: number
  isConnect: boolean
}

const storage = sessionStorage.getItem('connect')
const initialTasks: Connect =  storage ? JSON.parse(storage) : {
  address: "127.0.0.1",
  port: 8080,
  isConnect: false
}

const TasksContext = createContext<Connect>(initialTasks);

const TasksDispatchContext = createContext<any>(null);

export default useConnect

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useConnect() {
  return useContext(TasksContext);
}

export function useConnectDispatch() {
  return useContext(TasksDispatchContext);
}

interface ActionType {
  type: string
  address?: string
  port?: number
  isConnect?: boolean
}
function tasksReducer(tasks: Connect, action: ActionType) {
  switch (action.type) {
    case 'update': {
      action.address && (tasks.address = action.address)
      action.port && (tasks.port = action.port)

      if(action.isConnect !== undefined) {
        tasks.isConnect = action.isConnect
      }

      sessionStorage.setItem('connect', JSON.stringify({
        address: tasks.address,
        port: tasks.port,
        isConnect: tasks.isConnect
      }))
      return tasks
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
