import WebSocket from "ws";
import fs from "fs";

const port = 8080;
const server = new WebSocket.Server({ port });

// 用于跟踪每"个 URL 对应的客户端
const clients: Record<string, Set<WebSocket>> = {
  "/connect": new Set(),
  "/topology": new Set(),
  "/freq-plan": new Set(),
  "/text": new Set(),
  "/freq-list": new Set(),
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
            manage: ["4", "7"],
            center: ["1", "2"],
            user: ["5", "6", "8", "9"],
          },
          links: [
            ["4", "1"],
            ["1", "5"],
            ["1", "6"],
            ["7", "2"],
            ["2", "8"],
            ["2", "9"],
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
        ];
        ws.send(JSON.stringify(data));
      }, 1000);
    }
  }

  ws.on("message", (message) => {
    // 转发消息给所有连接到相同 URL 的客户
    switch (req.url) {
      case "/text": {
        console.log("Received data", message.toString());
        // ws.send(message); // 也可以在此处回显给发送方
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
