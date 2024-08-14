import { useCallback, useEffect, useRef } from "react";

function useWebWorker(myWorker: any) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new myWorker();
    workerRef.current = worker;

    return () => {
      worker.terminate(); // 组件卸载时终止 Web Worker
    };
  }, []);

  const postMessage = useCallback((message: any) => {
    workerRef.current?.postMessage(message);
  }, []);

  const onmessage = useCallback((callback: (e: MessageEvent) => void) => {
    workerRef.current!.onmessage = callback;
  }, []);

  return {
    workerRef,
    postMessage,
    onmessage,
  };
}

export default useWebWorker;
