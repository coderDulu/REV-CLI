import clsx from "clsx";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: "primary" | "default" | "danger";
  children: React.ReactNode;
}

function CButton({ buttonType = "default", ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx("w-20 h-9 border rounded-md ", {
        "border-[#0D8383] text-[#0D8383]": buttonType === "default",
        "border-[#0D8383] bg-[#0D8383] text-white": buttonType === "primary",
        "border-[#F17F7F] bg-white text-[#F17F7F]": buttonType === "danger",
        "bg-gray-400 text-gray-600 cursor-not-allowed opacity-60 border-transparent": props.disabled
      })}>
      {props.children}
    </button>
  );
}

export default CButton;
