import HeaderLayout from "./header/HeaderLayout";
import SiderLayout from "./SiderLayout";
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="flex w-full h-full flex-col">
      <HeaderLayout />
      <div className="flex flex-1">
        <SiderLayout />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
