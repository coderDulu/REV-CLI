interface Props {
  title: string;
  borderColor?: string;
  bgColor?: string;
  children: React.ReactNode;
}
function TxRxContainer({ borderColor, bgColor, title, children }: Props) {
  return (
    <div className={`flex flex-col gap-4 p-5 w-[620px] h-[553px] rounded-md mt-4 ml-4 border-solid border border-[${borderColor}] bg-[${bgColor}]`}>
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
}

export default TxRxContainer;
