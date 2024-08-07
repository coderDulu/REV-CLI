import { useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts";
import { isEqual } from "lodash-es";

const useECharts = (options: echarts.EChartsCoreOption) => {
  const domRef = useRef<HTMLElement | null>(null);
  const myChart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (domRef.current) {
      myChart.current = echarts.init(domRef.current as HTMLElement);
      myChart.current.setOption(options);
    }
    return () => {
      myChart.current?.dispose();
    };
  }, []);

  const isSame = useCallback((newVal: object, oldVal: object) => {
    return isEqual(newVal, oldVal);
  }, []);

  const update = () => {
    if (myChart.current && !isSame(options, myChart.current.getOption())) {
      try {
        myChart.current.setOption(options);
      } catch (error) {
        console.error("ECharts update error:", error);
      }
    }
  };

  return {
    domRef,
    myChart,
    update,
    isSame,
  };
};

export default useECharts;
