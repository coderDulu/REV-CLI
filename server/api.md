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

`path: /info/{node_id}`

## 3. 