import WebSocket from 'ws';

interface WebSocketClientOptions {
    // reconnectInterval?: number; // 重连间隔（毫秒）
    // maxRetries?: number; // 最大重连次数
    onOpen?: () => void; // 连接成功时的回调
    onMessage?: (data: WebSocket.Data) => void; // 接收到消息时的回调
    onClose?: () => void; // 连接关闭时的回调
    onError?: (error: Error) => void; // 连接出现错误时的回调
}

class WebSocketClient {
    private url: string;
    private options: WebSocketClientOptions;
    // private reconnectInterval: number;
    // private maxRetries: number;
    private retryCount: number;
    private ws!: WebSocket; // 使用非空断言来告诉 TypeScript 该变量一定会被初始化

    constructor(url: string, options: WebSocketClientOptions = {}) {
        this.url = url;
        this.options = options;
        // this.reconnectInterval = options.reconnectInterval || 5000; // 默认重连间隔
        // this.maxRetries = options.maxRetries || 10; // 默认最大重连次数
        this.retryCount = 0;

        this.connect();
    }

    private connect(): void {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            console.log('Connected to WebSocket server');
            this.retryCount = 0; // 重置重连计数
            if (this.options.onOpen) {
                this.options.onOpen();
            }
        });

        this.ws.on('message', (data: WebSocket.Data) => {
            // console.log('Received:', data);
            if (this.options.onMessage) {
                this.options.onMessage(data);
            }
        });

        this.ws.on('close', () => {
            console.log('Disconnected from WebSocket server');
            // if (this.retryCount < this.maxRetries) {
            //     this.retryCount++;
            //     setTimeout(() => this.connect(), this.reconnectInterval);
            // }
            if (this.options.onClose) {
                this.options.onClose();
            }
        });

        this.ws.on('error', (err: Error) => {
            console.error('WebSocket error:', err);
            if (this.options.onError) {
                this.options.onError(err);
            }
        });
    }

    public send(data: WebSocket.Data): void {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(data);
        } else {
            console.error('WebSocket is not open. Ready state:', this.ws.readyState);
        }
    }

    public close(): void {
        this.ws.close();
    }
}

export default WebSocketClient;
