# 接口

## websocket 接口 ws://{ip}:{port}/{path}

- 响应添加了A的为定时1s向前端发送一次数据

##  1. 设备连接

### 请求

`/connect`

### 响应

```json
{
  type: "connect",
  data: "success",
};
```

## 2. 拓扑
### 请求

`/topology`

### 响应（A）

```json
{
  "type": "topology",
  "data": {
    "nodes": {
      "manage": ["4", "7"], // 管理端
      "center": ["1", "2"], // 中心节点
      "user": ["5", "6", "8", "9"] // 用户节点
    },
    "links": [  // 节点间的连线
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

### 3. freq-plan
### 请求
`/freq-plan`
### 响应（A）



## 4. 域频段状态信息（A）
### 请求
`/freq-status`

### 响应（A）
```json
[
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
]
```

## 中心端
### 网络配置
### 实时网络传输速率
* 请求:
`/net-rate`
* 响应
```json
{ 
  "rate":65 
}
```


