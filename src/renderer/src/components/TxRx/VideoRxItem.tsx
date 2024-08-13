import { useEffect, useRef } from "react";
import "video.js/dist/video-js.css";
import flvjs from "flv.js";

import TxRxContainer from "./TxRxContainer";

const VideoRxItem = () => {
  return (
    <TxRxContainer title="接收视频" borderColor="#F0B376" bgColor="#fff7ef">
      <WebSocketVideoPlayer />
    </TxRxContainer>
  );
};

const WebSocketVideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && flvjs.isSupported()) {
      const flvPlayer = flvjs.createPlayer({
        type: "flv",
        url: "ws://localhost:8080/video",
        isLive: true,
        
      });
      flvPlayer.attachMediaElement(videoRef.current);
      flvPlayer.load();
      flvPlayer.play();

      return () => {
        flvPlayer.destroy();
      };
    }
  }, [videoRef]);

  return <video ref={videoRef} id="video-player" className="video-js vjs-default-skin" />;
};

export default VideoRxItem;
