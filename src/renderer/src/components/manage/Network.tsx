import { Divider } from "antd";
import useECharts from "@/hooks/useEcharts";

const configure = {
  "manage": {

  },
  "center": {},

}

function Network() {

  const { domRef } = useECharts({
    "title": {
      "text": "网络拓扑",
      "textStyle": {
        "fontSize": 24,
        "color": "#000"
      },
      "top": 40,
      "left": 40
    },
    "legend": [
      {
        "orient": "vertical",
        "top": 0,
        "right": 0
      }
    ],
    "series": [
      {
        "emphasis": {
          "focus": "series"
        },
        "categories": [{ name: "管理端" }, { name: "中心端" }, { name: "用户端" }],

        "type": "graph",
        "layout": "force",
        "draggable": true,
        "symbolSize": 50,
        "roam": true,
        "label": {
          "show": true
        },
        "edgeSymbol": [
          "circle",
          "arrow"
        ],
        "edgeSymbolSize": [
          4,
          10
        ],
        "data": [{
          name: "1",
          category: 0,
        },
        {
          name: "2",
          category: 1,
        },
        { name: "3", category: 2 }
        ],


        "links": [],
        force: {
          repulsion: 500
        },
        "animation": false,
      }
    ],
    "animation": false
  });
  return (<div className="flex w-full h-full">
    <div className="flex flex-col gap-6 w-96 p-10 m-4">
      <h1 className="font-bold text-2xl">网络列表</h1>
      <ul className="flex flex-col gap-6">
        <li>网络节点数目： 未选择</li>
        <li>当前工作频段： -10MHz-150MHz</li>
      </ul>
    </div>
    <Divider type="vertical" className="h-full" />
    <div className="flex-1 p-2">
      <div className="w-full h-full" ref={domRef}></div>
    </div>
  </div>);
}

export default Network;