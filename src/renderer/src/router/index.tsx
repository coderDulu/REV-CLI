/* eslint-disable react-refresh/only-export-components */
import { createHashRouter, Navigate } from "react-router-dom"
import { lazy, type ReactNode, Suspense } from "react"
import KeepAlive from "react-activation"

import App from "../App"
import UserStatus from "@/components/user/UserStatus"
import { Result } from "antd"
import TxRx from "@/components/TxRx/Index"
// center
import CenterView from "@/views/CenterView"
import NetworkConfig from "@/components/center/NetworkConfig"
import AutoFreq from "@/components/center/AutoFreq"
// user
import NodeStatus from "@/components/user/NodeStatus"
import NetworkStatus from "@/components/center/NetworkStatus"
// manage
import Spectrum from "@/components/manage/Spectrum"

const Manage = lazy(() => import("@/views/ManageView"))
const UserView = lazy(() => import("@/views/UserView"))
// manage
const Network = lazy(() => import("@/components/manage/Network"))
const FreqPlan = lazy(() => import("@/components/manage/FreqPlan"))

function addLazy(children: ReactNode) {
  return <Suspense fallback={<></>}>{children}</Suspense>
}

function Error() {
  return <Result status="404" title="404" subTitle="当前页面出现错误，请稍后重试。" />
}

export const menus = [
  {
    name: "manage",
    children: [
      { name: "全网态势", path: "/manage/network" },
      { name: "频谱状态", path: "/manage/status" },
      { name: "用频规划", path: "/manage/plan" },
    ],
  },
  {
    name: "center",
    children: [
      { name: "网络状态", path: "/center/net-status" },
      { name: "频谱管控", path: "/center/net-config" },
      { name: "信道感知", path: "/center/freq" },
      { name: "业务传输", path: "/center/txrx" },
    ],
  },
  {
    name: "user",
    children: [
      { name: "网络状态", path: "/user/node-status" },
      { name: "频谱状态", path: "/user/status" },
      { name: "业务传输", path: "/user/txrx" },
    ],
  },
]

const config = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/manage" replace /> },
      {
        path: "/manage",
        id: "manage",
        element: addLazy(<Manage />),

        children: [
          { index: true, element: <Navigate to="/manage/network" replace /> },
          {
            path: "/manage/network",
            element: addLazy(<Network />),
            errorElement: <Error />,
          },
          {
            path: "/manage/status",
            element: (
              <KeepAlive id="manage-status">
                <Spectrum />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/manage/plan",
            element: addLazy(<FreqPlan />),
            errorElement: <Error />,
          },
          {
            path: "*",
            element: <div>404</div>,
          },
        ],
      },
      {
        path: "/center",
        id: "center",
        element: <CenterView />,
        children: [
          {
            index: true,
            element: <Navigate to="/center/net-status" replace />,
          },
          {
            path: "/center/net-status",
            element: (
              <KeepAlive id="center-net-status">
                <NetworkStatus />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/center/net-config",
            element: (
              <KeepAlive id="center-net-config">
                <NetworkConfig />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/center/freq",
            element: (
              // <KeepAlive id="center-freq">
              <AutoFreq />
              // </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/center/txrx",
            element: (
              <KeepAlive id="center-tx-rx">
                <TxRx />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "*",
            element: <div>404</div>,
          },
        ],
      },
      {
        path: "/user",
        element: <UserView />,
        errorElement: <Error />,
        id: "user",
        children: [
          {
            index: true,
            element: <Navigate to="/user/node-status" replace />,
          },
          {
            path: "/user/node-status",
            element: (
              <KeepAlive id="user-node-status">
                <NodeStatus />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/user/status",
            element: (
              <KeepAlive id="user-status">
                <UserStatus />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "/user/txrx",
            element: (
              <KeepAlive id="user-txrx">
                <TxRx />
              </KeepAlive>
            ),
            errorElement: <Error />,
          },
          {
            path: "*",
            element: <div>404</div>,
          },
        ],
      },
    ],
  },
])

export default config
