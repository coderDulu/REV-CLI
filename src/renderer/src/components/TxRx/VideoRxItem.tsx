import { useEffect, useRef, useState } from "react";
import "video.js/dist/video-js.css";
import mpegts from "mpegts.js";
import { Empty, Spin } from "antd";
import clsx from "clsx";

import TxRxContainer from "./TxRxContainer";
import ActionButton from "@/components/common/ActionButtons";

const VideoRxItem = () => {
  return (
    <TxRxContainer title="接收视频" borderColor="#F0B376" bgColor="#fff7ef">
      <WebSocketVideoPlayer />
    </TxRxContainer>
  );
};

function startReceiveVideo(element: HTMLMediaElement) {
  if (mpegts.getFeatureList().mseLivePlayback) {
    const flvPlayer = mpegts.createPlayer(
      {
        type: "flv",
        url: "ws://localhost:8080/video",
        isLive: true,
      },
      {
        enableWorker: true,
        liveBufferLatencyChasing: true,
      }
    );

    flvPlayer.attachMediaElement(element);
    flvPlayer.load();
    // flvPlayer.play();

    return flvPlayer;
  }

  return null;
}

const WebSocketVideoPlayer = () => {
  const videoRef = useRef(null);
  const flvPlayerRef = useRef<mpegts.Player | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      flvPlayerRef.current = startReceiveVideo(videoRef.current);
    }
    return () => {
      flvPlayerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    window.electron.on("video-stopped", () => {
      onStop();
    });
  }, []);

  const onReceiveStart = () => {
    flvPlayerRef.current?.play();
    setIsSending(true);
  };

  const onStop = () => {
    if (flvPlayerRef.current) {
      flvPlayerRef.current.unload();

      setIsSending(false);
      flvPlayerRef.current.load();
    }
  };

  return (
    <div className="flex flex-col gap-10 p-5 w-full h-full">
      <div className={clsx("h-60 flex items-center justify-center", isSending ? "hidden" : "block")}>
        <Empty description="请先发送视频，然后点击接收按钮接收" />
      </div>
      <video ref={videoRef} className={clsx("border-2", isSending ? "block" : "hidden")} id="video-player"></video>
      <div className="self-center mt-auto">
        <ActionButton submitText="接收" sendingText="正在接收" isSending={isSending} onStart={onReceiveStart} onStop={onStop} />
      </div>
    </div>
  );
};

export default VideoRxItem;
