import { useState, useEffect } from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

const menus = [
  {
    name: 'manage',
    children: [
      { name: "全网态势", path: '/manage/network', },
      { name: "频谱状态", path: '/manage/status', },
      { name: "用频规划", path: '/manage/plan', },
    ]
  },
  {
    name: 'center',
    children: [
      { name: "网络状态", path: '/center/net-status', },
      { name: "自主选频", path: '/center/freq', },
      { name: "业务传输", path: '/center/txrx', },
    ]
  },
  {
    name: 'user',
    children: [
      { name: "节点状态", path: '/user/node-status', },
      { name: "业务传输", path: '/user/txrx', },
    ]
  }
]

function SiderLayout() {
  const [current, setCurrent] = useState(0);
  const location = useLocation();
  const [listMap, setListMap] = useState([])
  const navigate = useNavigate()

  const handleClick = (item, index) => {
    navigate(item.path)
    setCurrent(index);
  };

  useEffect(() => {
    const list = menus.find(item => location.pathname.includes(item.name))
    if (list) {
      setListMap(list.children)

      const findIndex = list.children.findIndex(item => item.path === location.pathname)
      setCurrent(findIndex)
    }
  }, [location.pathname])

  return (
    <ul className="w-36 h-full bg-[#023c3f] flex flex-col items-center gap-12 p-12">
      {listMap?.map((item, index) => {
        return (
          <li key={index} className={clsx("w-36 cursor-pointer flex flex-col gap-1 items-center hover:opacity-50",
            {
              "opacity-20": current !== index,
            }
          )} onClick={() => handleClick(item, index)}>
            <img
              src={`/icons/menu/${item.name}.png`}
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
