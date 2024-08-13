import { useCallback, useEffect, useRef } from "react";

function useWebWorker(url: URL) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(url);
    workerRef.current = worker;

    return () => {
      worker.terminate(); // 组件卸载时终止 Web Worker
    };
  }, [url]);

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
