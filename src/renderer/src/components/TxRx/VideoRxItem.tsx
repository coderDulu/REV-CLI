import { useCallback, useEffect, useRef, useState } from "react"
import mpegts from "mpegts.js"
import { Empty } from "antd"
import clsx from "clsx"
import useConnect from "@/hooks/useConnect"

import TxRxContainer from "./TxRxContainer"
import ActionButton from "@/components/common/ActionButtons"

const VideoRxItem = () => {
  return (
    <TxRxContainer title="接收视频" borderColor="#F0B376" bgColor="#fff7ef">
      <WebSocketVideoPlayer />
    </TxRxContainer>
  )
}

function startReceiveVideo(element: HTMLMediaElement, address: string, port: number) {
  if (mpegts.getFeatureList().mseLivePlayback) {
    const flvPlayer = mpegts.createPlayer(
      {
        type: "mse",
        url: `ws://${address}:${port}/video-rx`,
        isLive: true,
      },
      {
        enableWorker: true,
        liveBufferLatencyChasing: true,
      }
    )

    flvPlayer.attachMediaElement(element)
    flvPlayer.load()
    // flvPlayer.play();

    return flvPlayer
  }

  return null
}

const WebSocketVideoPlayer = () => {
  const videoRef = useRef(null)
  const flvPlayerRef = useRef<mpegts.Player | null>(null)
  const [isSending, setIsSending] = useState(false)
  const { address, port } = useConnect()

  useEffect(() => {
    if (videoRef.current) {
      flvPlayerRef.current = startReceiveVideo(videoRef.current, address, port)

      flvPlayerRef.current?.on(mpegts.Events.STATISTICS_INFO, (info) => {
        const { speed, decodedFrames } = info
        setIsSending((sending) => {
          if (speed === 0 && decodedFrames !== 0 && sending) {
            flvPlayerRef.current?.unload()
            flvPlayerRef.current?.detachMediaElement()
            flvPlayerRef.current?.attachMediaElement(videoRef.current)
            flvPlayerRef.current?.load()
            return false
          } else if (speed !== 0) {
            flvPlayerRef.current?.play()
            return true
          }

          return sending
        })
      })

      flvPlayerRef.current?.on(mpegts.Events.MEDIA_INFO, (info) => {
        console.log("info", info)
      })
    }
    return () => {
      flvPlayerRef.current?.destroy()
    }
  }, [])

  return (
    <div className="flex flex-col gap-10 p-5 w-full h-full">
      <div
        className={clsx("h-60 flex items-center justify-center", isSending ? "hidden" : "block")}
      >
        <Empty description="暂无数据" />
      </div>
      <video
        ref={videoRef}
        className={clsx("h-full", isSending ? "block" : "hidden")}
        id="video-player"
      ></video>
      {/* <iframe
      className="w-[1000px] h-[700px]"
        src="https://www.youtube.com/embed/HBD2EgKD0Zg?list=PLHNmWBpo58LWvImyoVnSftPINuJZMwBKN&start=9"
        // https://www.youtube.com/watch?v=HBD2EgKD0Zg&list=PLHNmWBpo58LWvImyoVnSftPINuJZMwBKN
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe> */}
    </div>
  )
}

export default VideoRxItem
