import { Flex } from "antd";
import RxItem from "./RxItem";
import TxItem from "./TxItem";

function Index() {
  return (
    <Flex className="w-full h-full p-6">
      <TxItem />
      <RxItem />
    </Flex>
  );
}

export default Index;
