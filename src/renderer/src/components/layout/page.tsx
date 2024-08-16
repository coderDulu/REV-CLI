import HeaderLayout from "./header/HeaderLayout";
import SiderLayout from "./SiderLayout";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex w-full h-full flex-col">
      <HeaderLayout />
      <div className="flex flex-1">
        <SiderLayout />
        <div className="overflow-auto flex-1 min-w-[1200px] min-h-[820px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
