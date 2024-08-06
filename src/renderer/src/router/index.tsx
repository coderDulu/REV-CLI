import { createHashRouter, Navigate } from "react-router-dom";

import App from "../App";
import Manage from "@/views/ManageView";
import CenterView from "@/views/CenterView";
import UserView from "@/views/UserView";

const config = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/manage" replace /> },
      {
        path: "/manage",
        id: "manage",
        element: <Manage />,

        children: [
          { index: true, element: <Navigate to="/manage/network" replace /> },
          {
            path: "/manage/network",
            element: <div>全网态势</div>,
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
        element: <CenterView />,
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
        element: <UserView />,
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
