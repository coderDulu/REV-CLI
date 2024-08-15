import { Image, Divider } from "antd";
import HeaderTabs from "./HeaderTabs";
import Connect from "./Connect";
import WindowControl from "./WindowControl";
import { getImageUrl } from "@/utils/getImageUrl";

function HeaderLayout() {
  return (
    <div className="h-20 w-full flex gap-4 items-center shadow-md app-drag">
      <div className="bg-[#356365] w-36 min-w-36 h-full flex items-center justify-center">
        <Image preview={false} width={53} src={getImageUrl("首页图标.png", "menu")} />
      </div>
      <div className="md:w-96">
        <HeaderTabs />
      </div>
      <Divider type="vertical" className="h-full" />
      {/* connect */}
      <Connect />
      {/* window-control */}
      <WindowControl />
    </div>
  );
}

export default HeaderLayout;
