import { useState, useEffect } from "react";
import clsx from "clsx";
import { useNavigate, useLocation } from 'react-router-dom'

const list = [
  {
    name: "管理端",
    value: "/manage",
  },
  {
    name: "中心端",
    value: "/center",
  },
  {
    name: "用户端",
    value: "/user",
  },
];

function HeaderTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const [choose, setChoose] = useState("manage");

  const handleClick = (value: string) => {
    navigate(value)
    setChoose(value)
  }

  useEffect(() => {
    const findIndex = list.findIndex((item) => location.pathname.includes(item.value));
    if (findIndex !== -1) {
      setChoose(list[findIndex].value)
    }
  }, [])

  return (
    <ul className="w-80 h-10 flex items-center  gap-1 mx-10 justify-center rounded-3xl bg-[#EDEDED]">
      {list.map((item) => (
        <li
          className={clsx("flex flex-1 h-full rounded-3xl border-none items-center justify-center cursor-pointer", { "bg-[#0d8383] text-white": choose === item.value })}
          key={item.value}
          onClick={() => handleClick(item.value)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default HeaderTabs;
