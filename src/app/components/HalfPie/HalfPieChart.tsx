import { ResponsivePie } from "@nivo/pie";
import { TPieDatum } from "./halfPieData";

type THalfPieProps = {
  data: TPieDatum[];
};

export const HalfPieChart = (props: THalfPieProps) => {
  const { data } = props;

  return (
    <ResponsivePie<TPieDatum>
      data={data}
      margin={{ top: 50, right: 0, bottom: 50, left: -50 }}
      innerRadius={0.5}
      startAngle={0}
      endAngle={180}
      padAngle={0.7}
      cornerRadius={3}
      colors={(d) => d.data.color}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsTextOffset={9}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsOffset={0}
      arcLinkLabelsDiagonalLength={18}
      arcLinkLabelsStraightLength={15}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLinkLabelsThickness={2}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "now",
          },
          id: "lines",
        },
      ]}
    />
  );
};
