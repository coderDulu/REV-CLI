import { Flex, Progress } from "antd";
import TxRxContainer from "./TxRxContainer";
import { useCallback, useEffect, useState } from "react";
import useWebWorker from "@/hooks/useWebWorkder";
import { downloadFile } from "@/utils/blob";
import CButton from "../common/CButton";
import { useImmer } from "use-immer";
import useConnect from "@/hooks/useConnect";

const url = new URL("@/workers/receiveFileWorker.ts", import.meta.url);

function FileRxItem() {
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useImmer({ name: "", size: 0, type: "", data: null });
  const { postMessage, onmessage } = useWebWorker(url);
  const { address, port } = useConnect()

  useEffect(() => {
    postMessage({
      type: "connect",
      url: `ws://${address}:${port}/file`
    });
  }, [address, port, postMessage]);

  const onClear = useCallback(() => {
    setProgress(0);
    setFileInfo({ name: "", size: 0, type: "", data: null });
  }, [setFileInfo]);

  useEffect(() => {
    onmessage((e) => {
      const { type } = e.data;
      switch (type) {
        case "fileInfo": {
          onClear();

          const { data } = e.data;
          setFileInfo((file) => {
            file = {
              ...data,
            };
            return file;
          });
          break;
        }
        case "file": {
          const { progress, data } = e.data;

          setProgress(progress);

          if (data) {
            setFileInfo((file) => {
              file.data = data;
              return file;
            });
            // fileInfo.current.data = data;
          }
          break;
        }
      }
    });
  }, [onClear, onmessage, setFileInfo]);

  const onSave = () => {
    if (fileInfo.data) {
      downloadFile(fileInfo.data, fileInfo.name);
      window.$message.success("保存成功");
    }
  };

  return (
    <TxRxContainer title="接收文件" borderColor="#F0B376" bgColor="#fff7ef">
      <Flex className="w-full h-full p-5" vertical>
        <Progress strokeColor="#f0b376" status="active" percent={progress} />
        {/* {fileInfo.current?.name} */}
        <FileList
          options={[
            { name: "文件名", label: fileInfo.name },
            { name: "文件大小", label: fileInfo.size },
          ]}
        />
        {/* {fileInfo.current.name} */}
        <Flex gap={10} className="mt-auto self-center">
          <CButton buttonType="primary" onClick={onSave}>
            保存
          </CButton>
          <CButton buttonType="danger" onClick={onClear}>
            清空
          </CButton>
        </Flex>
      </Flex>
    </TxRxContainer>
  );
}

interface FileInfo {
  name: string;
  label: any;
}

function FileList({ options }: { options: FileInfo[] }) {
  return (
    <ul className="mt-10 text-[#666666] flex flex-col gap-4">
      {options.map((item) => {
        return (
          <li key={item.name} className="border-b pr-10 flex justify-between">
            <span className="w-20">{item.name}</span>
            <span className="truncate">{item.label}</span>
          </li>
        );
      })}

      {/* <li className="border-b pr-10 flex justify-between">
        <span>文件大小(字节)</span>
        <span>{fileInfo.current.size}</span>
      </li> */}
    </ul>
  );
}

export default FileRxItem;
