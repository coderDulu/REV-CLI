import { Flex } from "antd";
import RxItem from "./RxItem";
import TxItem from "./TxItem";
import { useState } from "react";
import clsx from "clsx";

const options: TabsProp[] = [
  {
    name: "数据业务",
    children: (
      <Flex>
        <TxItem />
        <RxItem />
      </Flex>
    ),
  },
  {
    name: "视频业务",
  },
  {
    name: "文件业务",
  },
];

function Index() {
  return (
    <div className="w-full h-full">
      <Tabs options={options} />
    </div>
  );
}

interface TabsProp {
  name: string;
  children?: React.ReactNode;
}
function Tabs({ options }: { options: TabsProp[] }) {
  const [activeKey, setActiveKey] = useState(0);
  const activeStyle = "border-b border-b-4 border-b-[#0d8383] font-bold text-[#000] transition";

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <ul className="flex gap-10 shadow cursor-pointer h-16 pl-10 text-[#666666]">
        {options.map((item, index) => (
          <li
            key={index}
            onClick={() => setActiveKey(index)}
            className={clsx("h-full flex items-center justify-center", {
              [activeStyle]: activeKey === index,
            })}>
            {item.name}
          </li>
        ))}
      </ul>
      {options.map((item, index) => {
        return <div key={index}>{index === activeKey ? item.children : null}</div>;
      })}
    </div>
  );
}

export default Index;
