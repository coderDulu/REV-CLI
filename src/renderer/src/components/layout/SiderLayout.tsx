import { Image } from "antd";
import { useState } from 'react'
import clsx from "clsx";


// const 

function SiderLayout() {
  const [current, setCurrent] = useState(0)

  return (
    <ul className="w-36 h-full bg-[#023c3f] flex flex-col items-center gap-12 p-12">
      <li>
        <Image onClick={() => setCurrent()} preview={false} src="/icons/menu/全网态势.png" className={
          clsx("w-5 h-5", {
            "opacity-20": current === 0,
          })
        } />

      </li>
      <li>
        <Image preview={false} src="/icons/menu/频谱状态.png" className="w-5 h-5" />
      </li>
    </ul>
  );
}

export default SiderLayout;
