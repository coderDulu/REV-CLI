# 接口 v1.0.1

## websocket 接口 ws://{ip}:{port}/{path}

- 响应添加了 A 的为定时 1s 向前端发送一次数据

## 1. 设备连接 `/connect`

- 响应

```json
{
  "type": "connect",
  "data": "success",
};
```

## 2. 中心端

### 拓扑（A） `/topology`

- 响应：

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

#### 频段能量分布(A) `/network-bar`

- 响应：

```json
{
  "data": [1, 0, 0 ...] // 1024个数据
}
```

#### 业务信道参数获取(A) `/net-config-get`

- 响应：

```json
{
  "startFreq": 200, // 起始频点
  "autoChannel": true, // 自适应跳频
  "fixFreqMode": false, // 频点固定模式
  "bandSelect": 29 // 通道
}
```

### 业务信道参数设置 `/net-config-set`

- 请求：

```json
{
  "startFreq": 200, // 起始频点
  "autoChannel": true, // 自适应跳频
  "fixFreqMode": false, // 频点固定模式
  "bandSelect": 29 // 通道
}
```

- 响应：

```json
{
  "result": "success", // success 或者 error
  "message": "ok" // 对result的描述，主要是error时的描述
}
```

### 频谱管控状态（A） `/spectrum-status`

- 响应

```json
{
  "startFreq": 390,
  "endFreq": 550
}
```

### 实时网络传输速率（A） `/net-rate`

- 响应

```json
{
  "rate": 65
}
```

### 自主选频-子网干扰业务 `/network-freq-status`

- 响应

```json
{
  "field_num": 1,
  "start_freq": 250,
  "freq_status": [1, 1, 8, 2, "-", 3, 6, 6, "-", 1]
}
```

## 3. 业务传输

`逻辑就是：先发送目的地址，然后发送数据，收到什么数据就往目的地址发什么数据`

### 目的地址 "/address"

- 请求：

```json
1 // 该值为目的地址
```

### 数据传输 `/text`

### 视频传输 `/video`

### 文件传输 `file`

## 4. 用户端
### 获取节点id（A）
- 响应：
```json
{ 
  "type":"user",
  "data":5
}
```
### 节点频段能量分布
- 响应：
```json
[
  88.46648943500699,
  20.08267975450668,
  ...
] // 32个数据
```


