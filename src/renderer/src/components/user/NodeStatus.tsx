import { useCallback, useEffect, useState } from "react"
import ChannelUse from "../ChannelUse"
import NodeBar from "../NodeBar"
import useWebsocketConnect from "@/hooks/useWebsocketConnect"
import { useImmer } from "use-immer"
function NodeStatus() {
  const { connectToWebsocket, websocketRef } = useWebsocketConnect(`user`)
  const { connectToWebsocket: nodeBarWs } = useWebsocketConnect("node-bar")

  const [chooseNode, setChooseData] = useState("")
  const [data, setData] = useImmer([])

  useEffect(() => {
    connectToWebsocket()
  }, [connectToWebsocket])

  useEffect(() => {
    const ws = websocketRef.current
    const parseData = (ev) => {
      try {
        const parseData = JSON.parse(ev.data)
        setChooseData(parseData.data)
      } catch (error) {
        console.log(";error", error)
      }
    }
    ws?.addEventListener("message", parseData)

    return () => {
      ws?.removeEventListener("message", parseData)
    }
  }, [])

  const parseData = useCallback((ev) => {
    try {
      const message = JSON.parse(ev.data)
      // const showData = message.find((item) => item.node_mac === Number(chooseNode))
      // if (showData) {
      //   const { tunnel } = showData
      //   setData(tunnel)
      // }
      setData(message)
    } catch (error) {
      console.log("error", error)
    }
  }, [])

  useEffect(() => {
    nodeBarWs().then((res) => {
      res?.addEventListener("message", (ev) => {
        parseData(ev)
      })
    })
  }, [nodeBarWs, parseData])



  // useEffect(() => {
  //   const ws = websocketRef.current;
  //   ws?.addEventListener("message", parseData);

  //   return () => {
  //     ws?.removeEventListener("message", parseData);
  //   };
  // }, [parseData, websocketRef]);

  return (
    <div className="w-full h-full">
      <div className="w-full h-1/2">
        <ChannelUse chooseNode={chooseNode} />
      </div>
      <div className="w-full h-1/2">
        <NodeBar data={data} node={chooseNode} xLength={32}/>
      </div>
    </div>
  )
}

export default NodeStatus
