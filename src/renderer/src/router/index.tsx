import { createHashRouter } from "react-router-dom";
import App from "../App";
import Manage from "@/views/ManageView";
import CenterView from "@/views/CenterView";
import UserView from "@/views/UserView";

const config = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/manage',
        element: <Manage />,

      },
      {
        path: '/center',
        element: <CenterView />,

      }, {
        path: '/user',
        element: <UserView />,

      }
    ]
  },

]);

export default config;
