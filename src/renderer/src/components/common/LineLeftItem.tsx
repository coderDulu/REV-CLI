import { Divider } from "antd";

function LineLeftItem({children}) {
  return (
    <>
      <div className="flex flex-col gap-6 w-96 p-10 m-4">
        {children}
      </div>
      <Divider type="vertical" className="h-full" />
    </>
  );
}

export default LineLeftItem;
