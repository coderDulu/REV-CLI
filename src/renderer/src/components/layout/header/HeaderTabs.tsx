import { useState } from "react";
import clsx from "clsx";

const list = [
  {
    name: "管理端",
    value: "manage",
  },
  {
    name: "中心端",
    value: "center",
  },
  {
    name: "用户端",
    value: "user",
  },
];

function HeaderTabs() {
  const [choose, setChoose] = useState("manage");
  console.log(choose);
  return (
    <ul className="w-80 h-10 flex items-center  gap-1 mx-10 justify-center rounded-3xl bg-[#EDEDED]">
      {list.map((item) => (
        <li
          className={clsx("flex flex-1 h-full rounded-3xl border-none items-center justify-center cursor-pointer", { "bg-[#0d8383] text-white": choose === item.value })}
          key={item.value}
          onClick={() => setChoose(item.value)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default HeaderTabs;
