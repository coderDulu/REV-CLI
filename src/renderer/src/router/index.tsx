/* eslint-disable react-refresh/only-export-components */
import { createHashRouter, Navigate } from "react-router-dom";
import { lazy, type ReactNode, Suspense } from "react";

import App from "../App";
// import Manage from "@/views/ManageView";
// import CenterView from "@/views/CenterView";
// import UserView from "@/views/UserView";

const Manage = lazy(() => import("@/views/ManageView"));
const CenterView = lazy(() => import("@/views/CenterView"));
const UserView = lazy(() => import("@/views/UserView"));

const Network = lazy(() => import("@/components/manage/Network"));
const Spectrum = lazy(() => import("@/components/manage/Spectrum"));

const FreqPlan = lazy(() => import("@/components/manage/FreqPlan"));
const TxRx = lazy(() => import("@/components/TxRx/Index"));

function addLazy(children: ReactNode) {
  return <Suspense fallback={<></>}>{children}</Suspense>;
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
      { name: "自主选频", path: "/center/freq" },
      { name: "业务传输", path: "/center/txrx" },
    ],
  },
  {
    name: "user",
    children: [
      { name: "节点状态", path: "/user/node-status" },
      { name: "业务传输", path: "/user/txrx" },
    ],
  },
];

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
          },
          {
            path: "/manage/status",
            element: addLazy(<Spectrum />),
          },
          {
            path: "/manage/plan",
            element: addLazy(<FreqPlan />),
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
        element: addLazy(<CenterView />),
        children: [
          {
            index: true,
            element: <Navigate to="/center/net-status" replace />,
          },
          {
            path: "/center/net-status",
            element: <div>网络状态</div>,
          },
          {
            path: "/center/freq",
            element: <div>自主选频</div>,
          },
          {
            path: "/center/txrx",
            element: <TxRx />,
          },
          {
            path: "*",
            element: <div>404</div>,
          },
        ],
      },
      {
        path: "/user",
        element: addLazy(<UserView />),
        id: "user",
        children: [
          {
            index: true,
            element: <Navigate to="/user/node-status" replace />,
          },
          {
            path: "/user/node-status",
            element: <div>节点状态</div>,
          },
          {
            path: "/user/txrx",
            element: <div>业务传输</div>,
          },
          {
            path: "*",
            element: <div>404</div>,
          },
        ],
      },
    ],
  },
]);

export default config;
