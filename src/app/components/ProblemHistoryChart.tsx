import { CustomLayerProps, ResponsiveLine } from "@nivo/line";
import { TCardModel, useProblems } from "app/services/problems";
import { amber, grey, lightGreen, red } from "@mui/material/colors";
import { formatDate, getDatesBetween } from "app/helpers/date";
import { Theme } from "@nivo/core";

type TDate = string;
type TCategory = string;

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(
  cards: TCardModel[]
): Record<TDate, Record<TCategory, number>> {
  const map: Record<TDate, Record<TCategory, number>> = {};

  for (const card of cards) {
    const { difficulty } = card.leetcode;

    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const submap = map[date];
      const isNewCard = i === 0;
      const category = `${difficulty} - ${isNewCard ? "New" : "Review"}`;

      if (submap) {
        submap[category] = (submap[category] ?? 0) + 1;
      } else {
        map[date] = { [category]: 1 };
      }
    }
  }

  // Return the map
  return map;
}

function prepareChartData(cards: any[]): any[] {
  // Find the earliest and latest review dates
  let minDate = new Date();
  let maxDate = new Date(0);
  for (const card of cards) {
    for (const review of card.reviews) {
      const reviewDate = new Date(review.id);
      if (reviewDate < minDate) minDate = reviewDate;
      if (reviewDate > maxDate) maxDate = reviewDate;
    }
  }

  // Get all the dates between the earliest and latest review dates
  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const result: any[] = [];
  const categories = [
    "Easy - New",
    "Easy - Review",
    "Medium - New",
    "Medium - Review",
    "Hard - New",
    "Hard - Review",
  ];

  for (const category of categories) {
    const data: any[] = [];
    let total = 0;

    for (const date of dates) {
      total += map[date]?.[category] ?? 0;
      data.push({ x: date, y: total });
    }

    result.push({ id: category, data });
  }

  return result;
}

const DashedLine = ({
  series,
  lineGenerator,
  xScale,
  yScale,
}: CustomLayerProps) => {
  return series.map(({ id, data, color }) => {
    const d = lineGenerator(
      data.map((d) => ({
        x: (xScale as Function)(d.data.x),
        y: (yScale as Function)(d.data.y),
      }))
    )!;

    return (
      <path
        key={id}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={4}
        style={
          (id as string).endsWith("Review") ? { strokeDasharray: "12,3" } : {}
        }
      />
    );
  });
};

const legendTextStyle: Partial<React.CSSProperties> = {
  fill: grey[400],
  fontSize: 13,
  fontFamily: "sans-serif",
};

const chartTheme: Theme = {
  axis: {
    ticks: { text: legendTextStyle },
    legend: { text: legendTextStyle },
  },
  tooltip: {
    container: {
      fontFamily: "monospace",
    },
  },
};

export const ProblemHistoryChart = () => {
  const problems = useProblems();
  const chartData = prepareChartData(problems);

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
      curve="basis"
      theme={chartTheme}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
      }}
      colors={[
        lightGreen[500],
        lightGreen[500],
        amber[500],
        amber[500],
        red[500],
        red[500],
      ]}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        legendPosition: "middle",
        renderTick(props) {
          const { x, y, value } = props;

          // Only show the tick labels of the first month
          if (value.split("-")[2] !== "01") {
            return <></>;
          }

          return (
            <text x={x} y={y + 20} {...(legendTextStyle as any)}>
              {formatDate(new Date(value), "MMM")}
            </text>
          );
        },
      }}
      axisLeft={{
        tickSize: 0,
        legend: "Reviews",
        legendOffset: -35,
        legendPosition: "middle",
        tickValues: 5,
      }}
      layers={[
        "grid",
        "markers",
        "axes",
        "areas",
        "crosshair",
        DashedLine,
        "points",
        "slices",
        "mesh",
        "legends",
      ]}
      // enableArea
      // areaOpacity={0.8}
      lineWidth={3}
      enableGridX={false}
      gridYValues={5}
      enablePoints={false}
      useMesh
    />
  );
};
