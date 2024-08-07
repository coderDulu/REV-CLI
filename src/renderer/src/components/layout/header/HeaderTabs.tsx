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

  const choose =  list.find((item) => location.pathname.includes(item.value))?.value || "manage";

  const handleClick = (value: string) => {
    navigate(value)
  }

  return (
    <ul className="w-11/12 h-10  m-auto flex items-center gap-1 justify-center rounded-3xl bg-[#EDEDED]">
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
