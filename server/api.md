# 接口

## websocket 接口 ws://{ip}:{port}/{path}

- 响应添加了 A 的为定时 1s 向前端发送一次数据

## 1. 设备连接

### 请求

`/connect`

### 响应

```json
{
  type: "connect",
  data: "success",
};
```


## 中心端

### 拓扑（A）

- 请求：
`/topology`

- 响应（A）：
```json
{
  "type": "topology",
  "data": {
    "nodes": {
      "manage": ["4", "7"], // 管理端
      "center": ["1", "2"], // 中心节点
      "user": ["5", "6", "8", "9"] // 用户节点
    },
    "links": [
      // 节点间的连线
      ["4", "1"],
      ["1", "5"],
      ["1", "6"],
      ["7", "2"],
      ["2", "8"],
      ["2", "9"]
    ]
  }
}
```

### 网络配置

### 业务信道参数获取

- 请求：
  `net-config-get`
- 响应：

```json
{
  "startFreq": 200, // 起始频点
  "autoChannel": true, // 自适应跳频
  "fixFreqMode": false, // 频点固定模式
  "bandSelect": 29 // 通道
}
```

### 业务信道参数设置

- 请求：
  `net-config-set`
- 响应：

```json
{
  "startFreq": 200, // 起始频点
  "autoChannel": true,  // 自适应跳频
  "fixFreqMode": false, // 频点固定模式
  "bandSelect": 29,     // 通道
}
```

### 频谱管控状态
- 请求:
`/spectrum-status`
- 响应
```json
{
    "startFreq": 390,
    "endFreq": 550
}
```


### 实时网络传输速率
- 请求:
`/net-rate`
- 响应
```json
{
  "rate":65
}
```
