import WebSocket from "ws";
import fs from "fs";

const port = 8080;
const server = new WebSocket.Server({ port });

// 用于跟踪每"个 URL 对应的客户端
const clients: Record<string, Set<WebSocket>> = {
  "/connect": new Set(), // 设备连接
  "/topology": new Set(), // 网络拓扑
  "/freq-plan": new Set(), // 用频规划
  "/text": new Set(), // 文本传输
  "/video": new Set(), // 视频传输
  "/file": new Set(), // 文件传输
  "/freq-list": new Set(), // 频谱状态
  "/node-bar": new Set(), // 频段能量分布柱状图
  "/net-config": new Set(), // 网络配置参数设置
  "/spectrum-status": new Set(), // 频段状态
  "/net-rate": new Set(), // 实时网络速率
  "/business": new Set(), // 业务分布
};

server.on("connection", (ws, req) => {
  console.log("Client connected", req.url);

  // 将客户端添加到对应 URL 的集合中
  if (clients[req.url!]) {
    clients[req.url!].add(ws);
  } else {
    clients[req.url!] = new Set([ws]);
  }

  switch (req.url) {
    case "/connect": {
      const data = {
        type: "connect",
        data: "success",
      };
      ws.send(JSON.stringify(data));
      break;
    }
    case "/topology": {
      const data = {
        type: "topology",
        data: {
          nodes: {
            manage: ["4"],
            center: ["1"],
            user: ["5", "6"],
          },

          links: [
            ["4", "1"],
            ["1", "5"],
            ["1", "6"],
            ["7", "2"],
            ["2", "8"],
            ["2", "9"],
            ["1", "7"],
            ["1", "8"],
          ],
        },
      };
      setInterval(() => {
        ws.send(JSON.stringify(data));
      }, 1000);
      break;
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
          {
            field_num: 5, //域地址
            start_freq: 320, //域起始频点 -10
            freq_status: generateFreqStatus(),
          },
          {
            field_num: 6, //域地址
            start_freq: 120, //域起始频点 -10
            freq_status: generateFreqStatus(),
          },
        ];
        ws.send(JSON.stringify(data));
      }, 1000);
    }
    case "/node-bar": {
      setInterval(() => {
        const data = [
          {
            start_freq: 250, // 起始频点
            node_mac: 5, // 节点编号
            tunnel: [32, 25, 27, 33, 36, 41, 43, 47], // 信道数据
          },
          {
            start_freq: 250, // 起始频点
            node_mac: 6, // 节点编号
            tunnel: [22, 21, 24, 25, 28, 31, 35, 47], // 信道数据
          },
        ];
        ws.send(JSON.stringify(data));
      }, 1000);

      break;
    }
    case "/spectrum-status": {
      setInterval(() => {
        const data = {
          startFreq: 390,
          endFreq: 550,
        };
        ws.send(JSON.stringify(data));
      }, 1000);
      break;
    }
    case "/net-rate": {
      setInterval(() => {
        const data = {
          rate: Math.floor(Math.random() * 100),
        };
        ws.send(JSON.stringify(data));
      }, 1000);
      break;
    }
    case "/business": {
      const obj = [
        [1, 1], // [状态, 信道]
        [2, 2],
        [3, 3],
        [1, 4],
        [2, 5],
        [3, 6],
      ];
      const obj2 = [
        [1, 1], // [状态, 信道]
        [2, 2],
        [3, 3],
        [3, 4],
        [2, 5],
        [1, 6],
      ];
      let exchanged = false;

      setInterval(() => {
        if (exchanged) {
          ws.send(
            JSON.stringify({
              field_num: 5,
              data: obj,
            })
          );
          exchanged = false;
        } else {
          ws.send(
            JSON.stringify({
              field_num: 6,
              data: obj2,
            })
          );
          exchanged = true;
        }
      }, 1000);
    }
  }

  ws.on("message", (message) => {
    // 转发消息给所有连接到相同 URL 的客户
    switch (req.url) {
      case "/text": {
        console.log("Received data", message.toString());
        sendMessageToAllClients(message.toString(), req.url);
        break;
      }
      case "/file": {
        console.log("Received file", message);
        sendMessageToAllClients(message, req.url);
        break;
      }
      case "/video": {
        console.log("Received video", message);
        sendMessageToAllClients(message, req.url, ws);
        break;
      }
      case "/freq-plan": {
        console.log("freq-plan", message.toString());
        sendMessageToAllClients(message.toString(), req.url, ws);
        break;
      }
      case "/net-config": {
        console.log("net-config", message.toString());
        sendMessageToAllClients(message.toString(), req.url, ws);
        break;
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    // 从集合中移除已断开的客户端
    if (clients[req.url!]) {
      clients[req.url!].delete(ws);
    }
  });
});
function sendMessageToAllClients(message: any, path: string, ws?: WebSocket) {
  for (const client of clients[path]) {
    client.send(message);
  }
}

console.log(`WebSocket server is running on ws://localhost:${port}`);

function generateFreqStatus() {
  const arr = [];
  for (var i = 0; i < 10; i++) {
    var randomNum = Math.floor(Math.random() * 10);
    if (randomNum < 2) {
      // 约20%的概率生成'-'
      arr.push("-");
    } else {
      // 约80%的概率生成1-8的随机数
      arr.push(Math.floor(Math.random() * 8) + 1);
    }
  }
  return arr;
}
