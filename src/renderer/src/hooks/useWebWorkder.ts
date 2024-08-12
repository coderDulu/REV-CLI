import { useEffect, useRef, useState } from 'react';

function useWebWorker(workerFunction: () => void) {
  const [result, setResult] = useState<any>();
  const [error, setError] = useState("");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // 创建一个 Blob URL 用于 Web Worker
    const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    // 初始化 Web Worker
    const worker = new Worker(workerUrl);
    workerRef.current = worker;

    // 监听 Worker 消息
    worker.onmessage = (event) => {
      console.log('23',event.data);
      setResult(event.data);
    };

    // 监听 Worker 错误
    worker.onerror = (e) => {
      setError(e.message);
    };

    // 清理工作
    return () => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, [workerFunction]);

  // 向 Worker 发送消息的函数
  const postMessage = (message) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
    }
  };

  return { result, error, postMessage };
}

export default useWebWorker;
