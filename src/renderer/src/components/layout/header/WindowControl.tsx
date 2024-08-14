import { useState, useEffect } from "react";
import MinIcon from "@/assets/icons/header/最小化.png";
import RestoreIcon from "@/assets/icons/header/还原.png";
import CloseIcon from "@/assets/icons/header/关闭.png";
import MaxIcon from "@/assets/icons/header/最大化.png";

function WindowControl() {
  const [isMaximized, setIsMaximized] = useState(false);
  const minimize = () => {
    window.electron.invoke("window-control", "minimize");
  };

  useEffect(() => {
    getWindowStatus();
  }, []);

  const maximize = async () => {
    if (isMaximized) {
      window.electron.invoke("window-control", "restore");
    } else {
      window.electron.invoke("window-control", "maximize");
    }
    getWindowStatus();
  };

  const getWindowStatus = async () => {
    const isMax = await window.electron.invoke("window-status");
    setIsMaximized(isMax);
    return isMax;
  };

  const close = () => {
    window.electron.invoke("window-control", "close");
  };

  return (
    <div className="cursor-pointer flex gap-4 flex-1 justify-end mr-6 app-noDrag">
      <img src={MinIcon} onClick={minimize} className="w-5 h-5" />
      {isMaximized ? <img src={RestoreIcon} onClick={maximize} className="w-5 h-5" /> : <img src={MaxIcon} onClick={maximize} className="w-5 h-5" />}

      <img src={CloseIcon} onClick={close} className="w-5 h-5" />
    </div>
  );
}

export default WindowControl;
