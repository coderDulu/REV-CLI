import WebSocket from "ws"
import fs from "fs"
import * as url from "url"

const port = 8080
const server = new WebSocket.Server({ port, host: "0.0.0.0" })

// 用于跟踪每"个 URL 对应的客户端
const clients: Record<string, Set<WebSocket>> = {
  "/connect": new Set(), // 设备连接
  "/topology": new Set(), // 网络拓扑
  "/freq-config-get": new Set(), // 子网用频配置获取
  "/freq-config-set": new Set(), // 子网用频配置设置

  "/text-tx": new Set(), // 文本传输-发端
  "/text-rx": new Set(), // 文本传输-收端
  "/video-tx": new Set(), // 视频传输-发端
  "/video-rx": new Set(), // 视频传输-收端
  "/file-tx": new Set(), // 文件传输-发端
  "/file-rx": new Set(), // 文件传输-收端

  "/freq-list": new Set(), // 频谱状态
  "/net-config-set": new Set(), // 网络配置参数设置
  "/net-config-get": new Set(), // 网络配置参数获取
  "/spectrum-status": new Set(), // 频段状态
  "/net-rate": new Set(), // 实时网络速率
  "/business": new Set(), // 业务分布
  "/address": new Set(), // 设置业务传输目的地址
  // 中心端
  "/network-bar": new Set(), // 中心端-网络状态-频段能量分布
  "/network-freq": new Set(), // 中心端-自主选频-子网干扰业务分布
  "/network-freq-status": new Set(),
  // 用户端
  "/user": new Set(), // 用户端-获取用户id
  "/node-bar": new Set(), // 频段能量分布柱状图
  // 管理端
  "/manage-network-info": new Set(), // 网络列表
  "/freq-plan": new Set(), // 用频规划
  "/freq-status-bar": new Set(), // 频谱使用状态
  "/manage-spectrum-status": new Set(), // 干扰业务分布以及柱状图
}

server.on("connection", (ws, req) => {
  console.log("Client connected", req.url)
  const { pathname, query } = url.parse(req.url ?? "", true)
  // console.log('pathname', pathname);
  // console.log('query', query);
  // 将客户端添加到对应 URL 的集合中
  if (clients[req.url!]) {
    // if(pathname === "/manage-network-info") {
    //   setTimeout(() => {
    //     ws.close()
    //   }, 10000);
    // }
    clients[pathname!].add(ws)
  } else {
    clients[pathname!] = new Set([ws])
  }

  switch (pathname) {
    case "/manage-spectrum-status": {
      setInterval(() => {
        const obj = [
          {
            network: 1,
            data: generateData(32),
            startFreq: 380,
            endFreq: 540,
          },
          {
            network: 2,
            data: generateData(32),
            startFreq: 400,
            endFreq: 560,
          },
        ]
        ws.send(JSON.stringify(obj))
      }, 16)
      break
    }
    case "/connect": {
      ws.send(4)
      break
    }
    case "/topology": {
      const data = {
        manage: [0],
        center: [4, 8],
        user: [5, 6, 9, 10],
        links: [
          [0, 4],
          [0, 8],
          [4, 5],
          [4, 6],
          [8, 9],
          [8, 10],
          [5, 6],
        ],
      }
      setInterval(() => {
        ws.send(JSON.stringify(data))
      }, 1000)
      break
    }
    case "/freq-status": {
      setInterval(() => {
        const data = [
          //域频段状态信息
          {
            field_num: 1, //域地址
            start_freq: 250, //域起始频点 -10
            freq_status: generateFreqStatus(),
          },
          {
            field_num: 2, //域地址
            start_freq: 350, //域起始频点 -10
            freq_status: generateFreqStatus(),
          },
          // {
          //   field_num: 5, //域地址
          //   start_freq: 320, //域起始频点 -10
          //   freq_status: generateFreqStatus(),
          // },
          // {
          //   field_num: 6, //域地址
          //   start_freq: 120, //域起始频点 -10
          //   freq_status: generateFreqStatus(),
          // },
        ]
        ws.send(JSON.stringify(data))
      }, 1000)
      break
    }
    case "/node-bar": {
      setInterval(() => {
        // const data = [
        //   {
        //     start_freq: 250, // 起始频点
        //     node_mac: 5, // 节点编号
        //     tunnel: generateData(32), // 信道数据
        //   },
        //   {
        //     start_freq: 250, // 起始频点
        //     node_mac: 6, // 节点编号
        //     tunnel: generateData(32), // 信道数据
        //   },
        // ]
        ws.send(JSON.stringify(generateData(32)))
      }, 30)

      break
    }
    case "/network-bar": {
      setInterval(() => {
        const data = generateData(1024)
        ws.send(JSON.stringify(data))
      }, 30)
      break
    }
    case "/spectrum-status": {
      setInterval(() => {
        const start = getRandomInt(230, 300)
        const end = getRandomInt(300, 670)
        const data = {
          startFreq: start,
          endFreq: end,
          network: 1,
        }

        ws.send(JSON.stringify(data))
      }, 1000)
      break
    }
    case "/net-rate": {
      setInterval(() => {
        const data = {
          rate: Math.floor(Math.random() * 70000),
        }
        ws.send(JSON.stringify(data))
      }, 100)
      break
    }
    case "/business": {
      const obj = [
        [1, 1], // [状态, 信道]
        [2, 2],
        [3, 3],
        [1, 4],
        [2, 5],
        [3, 6],
      ]
      const obj2 = [
        [1, 1], // [状态, 信道]
        [2, 2],
        [3, 3],
        [3, 4],
        [2, 5],
        [1, 6],
      ]
      let exchanged = false

      setInterval(() => {
        if (exchanged) {
          ws.send(
            JSON.stringify({
              field_num: 5,
              data: obj,
            })
          )
          exchanged = false
        } else {
          ws.send(
            JSON.stringify({
              field_num: 6,
              data: obj2,
            })
          )
          exchanged = true
        }
      }, 1000)
    }
    case "/user": {
      let id = 5
      setInterval(() => {
        // if (id === 5) {
        //   id = 6
        // } else {
        //   id = 5
        // }
        sendMessageToAllClients(
          JSON.stringify({
            type: "user",
            data: id,
          }),
          pathname,
          ws
        )
      }, 1000)
      break
    }
    case "/manage-network-info": {
      // setInterval(() => {
        const network1 = [240, 400]
        const network2 = [370, 440]
        const data = [
          {
            network: 1, // 子网
            freqBand: network1, // 频点范围
            mode: 0, // 0 -> 自适应跳频，1 -> 频点固定模式
            bandSelect: 1, // 通道
            freq: 277.5, // 频点
          },
          {
            network: 2, // 子网
            freqBand: network2, // 频点范围
            mode: 1, // 0 -> 自适应跳频，1 -> 频点固定模式
            bandSelect: 9, // 通道
            freq: 299.5, // 频点
          },
        ]

        sendMessageToAllClients(JSON.stringify(data), pathname, ws)
      // }, 1000)
      break
    }
    case "/net-config-get": {
      console.log("net-config-get")
      sendMessageToAllClients(
        JSON.stringify({
          startFreq: 200,
          autoChannel: true,
          fixFreqMode: false,
          bandSelect: 29,
        }),
        pathname,
        ws
      )
      break
    }
    case "/network-freq-status": {
      setInterval(() => {
        const data = {
          field_num: 1, //域地址
          start_freq: 250, //域起始频点 -10
          freq_status: generateFreqStatus(),
        }

        ws.send(JSON.stringify(data))
      }, 1000)
      break
    }
  }

  ws.on("message", (message) => {
    // 转发消息给所有连接到相同 URL 的客户
    switch (req.url) {
      case "/freq-config-get": {
        const body = JSON.parse(message.toString())
        const network = +body.network
        const data = {
          startFreq: network === 1 ? 240 : 290, // 起始频点
          mode: network - 1, // 0 -> 自适应跳频，1 -> 频点固定模式
          bandSelect: network + 20, // 通道
          network: network, // 子网
        }

        console.log(req.url, body, "\n")
        sendMessageToAllClients(JSON.stringify(data), req.url, ws)
        break
      }
      case "/freq-config-set": {
        console.log(req.url, message.toString(), "\n")
        sendMessageToAllClients(
          JSON.stringify({
            result: "success", // success 或者 error
            message: "ok", // 对result的描述，主要是error时的描述
          }),
          req.url,
          ws
        )
        break
      }
      case "/text-tx": {
        console.log("Received data", message.toString())
        sendMessageToAllClients(message.toString(), "/text-rx")
        break
      }
      case "/file-tx": {
        console.log("Received file", message)
        sendMessageToAllClients(message, "/file-rx")
        break
      }
      case "/video-tx": {
        console.log("Received video", message)
        sendMessageToAllClients(message, "/video-rx", ws)
        break
      }
      case "/freq-plan": {
        console.log("freq-plan", message.toString())
        sendMessageToAllClients(message.toString(), req.url, ws)
        break
      }
      case "/net-config-set": {
        console.log("net-config-set", message.toString())
        sendMessageToAllClients(message.toString(), req.url, ws)
        break
      }
      case "/address": {
        console.log("address", message.toString())
        sendMessageToAllClients(message.toString(), req.url, ws)
        break
      }
    }
  })

  ws.on("close", () => {
    console.log("Client disconnected", req.url)
    // 从集合中移除已断开的客户端
    if (clients[req.url!]) {
      clients[req.url!].delete(ws)
    }
  })
})
function sendMessageToAllClients(message: any, path: string, ws?: WebSocket) {
  for (const client of clients[path]) {
    client.send(message)
  }
}

console.log(`WebSocket server is running on ws://localhost:${port}`)

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateFreqStatus() {
  const arr = []
  for (var i = 0; i < 10; i++) {
    var randomNum = Math.floor(Math.random() * 10)
    if (randomNum < 2) {
      // 约20%的概率生成'-'
      arr.push("-")
    } else {
      // 约80%的概率生成1-8的随机数
      arr.push(Math.floor(Math.random() * 8) + 1)
    }
  }
  return arr
}

function generateData(number: number) {
  const data = []

  // 生成两个大于 10000 的随机数
  for (let i = 0; i < 2; i++) {
    const random = Math.floor(Math.random() * (65536 - 10000)) + 10000
    data.push(random)
  }

  // 生成其余小于 5000 的随机数
  for (let i = 2; i < number; i++) {
    const random = Math.floor(Math.random() * 5000)
    data.push(random)
  }

  // 打乱数组顺序
  return data.sort(() => Math.random() - 0.5)
}
