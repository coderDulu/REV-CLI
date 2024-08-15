import { useRef, useEffect, useCallback } from "react";
import * as echarts from "echarts";
import { isEqual } from "lodash-es";

const useECharts = (initOption: echarts.EChartsCoreOption) => {
  const domRef = useRef<HTMLElement | null>(null);
  const myChart = useRef<echarts.ECharts | null>(null);

  const handleResize = useCallback(() => {
    myChart.current?.resize();
  }, []);

  useEffect(() => {
    if (domRef.current) {
      myChart.current = echarts.init(domRef.current as HTMLElement);
      myChart.current.setOption(initOption);
      myChart.current.showLoading();

      window.addEventListener("resize", handleResize);
    }
    return () => {
      myChart.current?.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSame = useCallback((newVal: object, oldVal: object) => {
    return isEqual(newVal, oldVal);
  }, []);

  /**
   * 更新图表
   * newOption 需要更新的配置
   * lastOption 上一次的配置
   */
  const update = useCallback((newOption: echarts.EChartsCoreOption, lastOption: echarts.EChartsCoreOption = {}) => {
    if (myChart.current) {
      try {
        if (!isSame(newOption, lastOption)) {
          myChart.current.setOption(newOption);

          myChart.current.hideLoading();
        }
      } catch (error) {
        console.error("ECharts update error:", error);
      }
    }
  }, []);

  return {
    domRef,
    myChart,
    update,
    isSame,
  };
};

export default useECharts;
