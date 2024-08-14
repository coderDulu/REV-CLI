import { useCallback, useEffect } from "react";
import useEcharts from "./useEcharts";

const colors = ["#efbe8d", "#71b4b9", "#e9a3a3"];
const intXAxis = new Array(24).fill(24).map((_: any, index) => index + 1);

function initOption(name?: number) {
  return {
    title: {
      text: `子网${name ?? ""}干扰业务分布`,
      top: "10px",
      left: "4%",
      textStyle: {
        fontSize: 24,
        color: "#000",
      },
    },
    xAxis: {
      data: intXAxis,
    },
    yAxis: {
      type: "category",
      data: [],
      splitArea: {
        show: true,
      },
    },
    visualMap: {
      pieces: [
        { min: 1, max: 1, label: "干扰", color: colors[0] },
        { min: 2, max: 2, label: "业务", color: colors[1] },
        { min: 3, max: 3, label: "冲突", color: colors[2] },
      ],
      min: 1,
      max: 3,
      type: "piecewise",
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "4%",
    },
    series: [
      {
        type: "heatmap",
        data: [],
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
}

/**
 * 更新配置
 * @param freqStatus [1,2,3,0,1,2,3]
 * @param startFreq 230
 * @param networkArr freqStatus[]
 * @returns option配置对象
 */
const updateData = (freqStatus: any[], startFreq: number, networkArr: number[][]) => {
  const intAYAxis = [
    startFreq - 10 + "MHz",
    startFreq + 10 + "MHz",
    startFreq + 30 + "MHz",
    startFreq + 50 + "MHz",
    startFreq + 70 + "MHz",
    startFreq + 90 + "MHz",
    startFreq + 110 + "MHz",
    startFreq + 130 + "MHz",
  ];

  if (networkArr.length >= intXAxis.length) {
    networkArr.shift();
  }
  networkArr.push(freqStatus);

  const varData: any = [];
  let startIdx = networkArr.length - 1;
  networkArr.forEach((element: any) => {
    for (let yIdx = 0; yIdx < 8; yIdx++) {
      const tmpData = [startIdx, yIdx, element[yIdx]];
      varData.push(tmpData);
    }
    startIdx = startIdx - 1;
  });

  return {
    tooltip: {
      position: "top",
      formatter: function (params: any) {
        const yValue = intAYAxis[params.value[1]];
        if (params.value[2] == 1) {
          return `${yValue}: 干扰`;
        }
        if (params.value[2] == 2) {
          return `${yValue}: 业务`;
        }
        if (params.value[2] == 3) {
          return `${yValue}: 冲突`;
        } else {
          return "";
        }
      },
    },
    yAxis: {
      data: intAYAxis,
    },
    series: [
      {
        data: varData,
      },
    ],
  };
};

export function useHeatmap(name?: number) {
  const heatmapEcharts = useEcharts(initOption(name));
  const optionSelected = {
    0: true,
    1: true,
    2: true,
  };
  const networkArr = [];

  useEffect(() => {
    heatmapEcharts.myChart.current?.on("datarangeselected", (params: any) => {
      Object.assign(optionSelected, params.selected);
    });
  }, []);

  // 更新图表
  const update = useCallback((freqStatus: any[], startFreq: number) => {
    const newData = updateData(freqStatus, startFreq, networkArr);
    heatmapEcharts.myChart.current?.setOption(newData);
    heatmapEcharts.myChart.current?.dispatchAction({
      type: "selectDataRange",
      selected: optionSelected,
    });
  }, []);

  return {
    update,
    heatmapEcharts,
  };
}
