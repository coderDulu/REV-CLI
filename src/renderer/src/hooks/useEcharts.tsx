import { useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts";
import { isEqual } from "lodash-es";

const useECharts = (options: echarts.EChartsCoreOption) => {
  const domRef = useRef<HTMLElement | null>(null);
  const myChart = useRef<echarts.ECharts | null>(null);

  const handleResize = useCallback(() => {
    myChart.current?.resize();
  }, []);

  useEffect(() => {
    if (domRef.current) {
      myChart.current = echarts.init(domRef.current as HTMLElement);
      myChart.current.setOption(options);

      window.addEventListener("resize", handleResize);
    }
    return () => {
      myChart.current?.dispose();
      window.removeEventListener('resize', handleResize)
    };
  }, [options, handleResize]);

  const isSame = useCallback((newVal: object, oldVal: object) => {
    return isEqual(newVal, oldVal);
  }, []);

  const update = (newOptions: echarts.EChartsCoreOption) => {
    if (myChart.current && !isSame(newOptions, myChart.current.getOption())) {
      try {
        myChart.current.setOption(newOptions);
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
