import WebSocket from "ws";

const port = 8080;
const server = new WebSocket.Server({ port });

// 用于跟踪每"个 URL 对应的客户端
const clients: Record<string, Set<WebSocket>> = {
  "/connect": new Set(),
  "/topology": new Set(),
  "/freqPlanSet": new Set(),
  "/text": new Set(),
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
    case "/freqPlanSet": {
      console.log("23", "freqPlanSet");
      break;
    }
  }

  ws.on("message", (message) => {
    // 转发消息给所有连接到相同 URL 的客户
    switch (req.url) {
      case "/text": {
        console.log("Received data", message.toString());
        // ws.send(message); // 也可以在此处回显给发送方
        sendMessageToAllClients(message.toString(), req.url)
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
function sendMessageToAllClients(message: any, path: string) {
  for (const client of clients[path]) {
    console.log('me', message);
    client.send(message);
  }
}

console.log(`WebSocket server is running on ws://localhost:${port}`);
