import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";
import { menus } from "@/router";
import { getImageUrl } from "@/utils/getImageUrl";

function SiderLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const listMap = menus.find(item => location.pathname.includes(item.name))?.children || []
  const current = listMap.findIndex(item => item.path === location.pathname)

  const handleClick = (item: { name?: string; path: string; }) => {
    navigate(item.path)
  };


  return (
    <ul className="w-36 h-full bg-[#023c3f] flex flex-col items-center gap-12 p-12">
      {listMap?.map((item, index) => {
        return (
          <li key={index} className={clsx("w-36 cursor-pointer flex flex-col gap-1 items-center hover:opacity-50",
            {
              "opacity-20": current !== index,
            }
          )} onClick={() => handleClick(item)}>
            <img
              src={getImageUrl(`${item.name}.png`, "menu")}
              className={clsx("w-10 h-10")}
            />
            <span
              className={clsx("text-white")}>
              {item.name}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default SiderLayout;
