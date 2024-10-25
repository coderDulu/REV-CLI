# 接口 v1.0.6

## websocket 接口 ws://{ip}:{port}/{path}

- 响应添加了 A 的为定时 1s 向前端发送一次数据

## 通用

### 1. 设备连接 `/connect`

- 响应

```json
{
  "type": "connect",
  "data": "success",
};
```

### 2. 子网用频配置获取 `/freq-config-get`

- 请求

```json
{
  "network": 1 // 子网 1 | 2，获取对应子网的配置
}
```

- 响应：

```json
{
  "network": 1, // 子网 1 | 2
  "startFreq": 200, // 起始频点
  "mode": true, // 0 -> 自适应跳频，1 -> 频点固定模式
  "bandSelect": 29 // 通道
}
```

### 3. 子网用频配置设置 `/freq-config-set`

- 请求：

```json
{
  "startFreq": 200, // 起始频点
  "mode": 0, // 0 -> 自适应跳频，1 -> 频点固定模式
  "bandSelect": 29, // 通道
  "network": 1 // 子网
}
```

- 响应：

```json
{
  "result": "success", // success 或者 error
  "message": "ok" // 对result的描述，主要是error时的描述
}
```

## 2. 中心端

### 拓扑（A） `/topology`

- 响应：

```json
{
  "manage": [0],
  "center": [4, 8],
  "user": [5, 6, 9, 10],
  "links": [
    [0, 4],
    [0, 8],
    [4, 5],
    [4, 6],
    [8, 9],
    [8, 10],
    [5, 6]
  ]
}
```

### 网络配置

#### 频段能量分布(A) `/network-bar`

- 响应：

```json
[1, 0, 0 ...] // 1024个数据
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

### 数据传输

#### 发端 `/text-tx`

#### 收端 `/text-rx`

### 视频传输

#### 发端 `/video-tx`

#### 收端 `/video-rx`

### 文件传输 `file`

#### 发端 `/file-tx`

#### 收端 `/file-rx`

## 4. 用户端

### 获取节点 id（A） `/user`

- 响应：

```json
{
  "type": "user",
  "data": 5
}
```

### 节点频段能量分布 `/node-bar`

- 响应：

```json
[
  88.46648943500699,
  20.08267975450668,
  ...
] // 32个数据
```

## 5. 管理端

### 子网用频配置获取 `/freq-config-get`

- 请求：

```json
{ "network": "1" } // 子网 1 | 2，表示获取子网几的用频配置
```

- 响应：

```json
{
  "startFreq": 240, // 起始频点
  "mode": 0, // 0 -> 自适应跳频，1 -> 频点固定模式
  "bandSelect": 21, // 通道
  "network": 1 // 子网
}
```

### 子网用频配置设置 `/freq-config-set`

- 请求：

```json
{
  "startFreq": 290, // 起始频点
  "mode": 1, // 0 -> 自适应跳频，1 -> 频点固定模式
  "bandSelect": 18, // 通道
  "network": 2 // 子网
}
```

- 响应：

```json
{
  "result": "success", // success 或者 error
  "message": "ok" // 对result的描述，主要是error时的描述
}
```

### 全网态势-网络信息 `/manage-network-info`

- 响应：

```json
[
  {
    "network": 1, // 子网
    "freqBand": [230, 390], // 频点范围
    "mode": 0, // 0 -> 自适应跳频，1 -> 频点固定模式
    "bandSelect": 1, // 通道
    "freq": 277.5 // 频点
  },
  {
    "network": 2, // 子网
    "freqBand": [250, 410], // 频点范围
    "mode": 1, // 0 -> 自适应跳频，1 -> 频点固定模式
    "bandSelect": 9, // 通道
    "freq": 299.5 // 频点
  }
]
```

### 频谱状态页面接口 `/manage-spectrum-status`

- 响应：

```json
[
  {
    "network": 1, // 子网编号
    "data": [
      2720, 2818, 1610, 3907, 220, 2090, 2132, 1418, 46269, 1208, 15362, 138, 3558, 4050, 3038,
      3718, 1958, 3939, 376, 990, 3662, 1936, 4985, 1231, 3951, 109, 4598, 3977, 4637, 1540, 3534,
      1197
    ] // 柱状图数据
  },
  {
    "network": 2,
    "data": [
      325, 196, 2774, 52128, 4026, 2023, 1435, 1978, 4642, 4177, 55, 4269, 3099, 1630, 1144, 2833,
      4247, 39959, 1829, 4321, 4079, 3662, 3622, 4583, 503, 858, 2552, 2631, 2863, 2088, 350, 3278
    ]
  }
]
```

### 用频规划 `/freq-plan`

- 请求：

```json
{
  "network": 1, // 子网
  "startFreq": 230, // 起始频点
  "mode": 0, // 0 -> 自适应跳频，1 -> 频点固定模式
  "bandSelect": 1 // 通道
}
```
