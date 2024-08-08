# 接口

## websocket 接口 ws://{ip}:{port}/{path}

## 1. 管理端 - 全网态势界面

### 请求

`path: /topology`

### 响应

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
