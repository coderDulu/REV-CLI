import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import config from './router/index'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={{
      components: {
        Button:{
          defaultColor: "#0D8383",
          defaultBorderColor: "#0D8383",
          defaultHoverColor: "#0D8383",
          defaultHoverBorderColor: "#0D8383",

        },
        Radio:{
          colorPrimary: "#0d8383"
        }
      },
    
    }}>
      <RouterProvider router={config} />
    </ConfigProvider>
  </React.StrictMode>
)
