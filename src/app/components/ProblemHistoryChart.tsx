import { CustomLayerProps, ResponsiveLine } from "@nivo/line";
import { TCardModel, useProblems } from "app/services/problems";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import { amber, lightGreen, red } from "@mui/material/colors";

// A helper function that returns an array of dates between two dates
function getDatesBetween(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const diff = differenceInDays(end, start);
  for (let i = 0; i <= diff; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(format(date, "yyyy-MM-dd"));
  }
  return dates;
}

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
      const date = format(review.id, "yyyy-MM-dd");
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

export const ProblemHistoryChart = () => {
  const problems = useProblems();
  const chartData = prepareChartData(problems);

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      curve="basis"
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
        ariaHidden: true,
        format: () => "",
        legend: "Time",
        legendOffset: 15,
        legendPosition: "middle",
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
      legends={[
        {
          anchor: "right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 95,
          itemHeight: 16,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};
