import WebSocket from "ws";

const port = 8080;
const server = new WebSocket.Server({ port });

server.on("connection", (ws, req) => {
  console.log("Client connected", req.url);

  switch (req.url) {
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
    }
  }

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
