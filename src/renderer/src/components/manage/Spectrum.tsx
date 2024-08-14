import { useHeatmap } from "@/hooks/useHeatmap";
import { Flex } from "antd";

function Spectrum() {
  const { heatmapEcharts } = useHeatmap(1);
  const { heatmapEcharts: heatmapEcharts2 } = useHeatmap(2);
  return (
    <Flex vertical gap={10} className="w-full h-full">
      <div className="flex-1" ref={(dom) => (heatmapEcharts.domRef.current = dom)}></div>
      <div className="flex-1" ref={(dom) => (heatmapEcharts2.domRef.current = dom)}>
        2
      </div>
    </Flex>
  );
}

export default Spectrum;
