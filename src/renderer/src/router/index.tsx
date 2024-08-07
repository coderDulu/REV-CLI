import { createHashRouter, Navigate } from "react-router-dom";
import { lazy, LazyExoticComponent, type ReactNode, Suspense } from 'react'

import App from "../App";
// import Manage from "@/views/ManageView";
// import CenterView from "@/views/CenterView";
// import UserView from "@/views/UserView";

const Manage = lazy(() => import("@/views/ManageView"));
const CenterView = lazy(() => import("@/views/CenterView"));
const UserView = lazy(() => import("@/views/UserView"));

const Network = lazy(() => import("@/components/manage/Network"))

function addLazy(children: ReactNode) {
  return (
    <Suspense fallback={<h2>加载中....</h2>}>
      {children}
    </Suspense>
  )

}

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
            element: addLazy(<Network/>),
          },
          {
            path: '*',
            element: <div>404</div>,
          }
        ],
      },
      {
        path: "/center",
        id: "center",
        element: addLazy(<CenterView />),
        children: [
          {
            index: true,
            element: <Navigate to="/center/net-status" replace />
          },
          {
            path: '/center/net-status',
            element: <div>网络状态</div>
          },
          {
            path: '/center/freq',
            element: <div>自主选频</div>
          },
          {
            path: '/center/txrx',
            element: <div>业务传输</div>
          },
          {
            path: '*',
            element: <div>404</div>,
          }
        ]
      },
      {
        path: "/user",
        element: addLazy(<UserView />),
        id: "user",
        children: [
          {
            index: true,
            element: <Navigate to="/user/node-status" replace />
          },
          {
            path: '/user/node-status',
            element: <div>节点状态</div>
          },
          {
            path: '/user/txrx',
            element: <div>业务传输</div>
          },
          {
            path: '*',
            element: <div>404</div>,
          }
        ]
      },
    ],
  },
]);

export default config;
