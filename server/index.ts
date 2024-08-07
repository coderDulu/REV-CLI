import WebSocket from 'ws';

const port = 8080;
const server = new WebSocket.Server({ port });

server.on('connection', (ws) => {
  console.log('Client connected');
  ws.send('Hello from server');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
