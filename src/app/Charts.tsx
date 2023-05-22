import { PropsWithChildren } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useSelector } from "app/store/setup";
import { TotalReviewHistory } from "app/components/TotalReviewHistory";
import { ReviewCalendar } from "./components/ReviewCalendar";
// import { CardTypeFunnel } from "./components/CardTypeFunnel";
// import { ScatterPlot } from "./components/ScatterPlot";
import { SwarmPlot } from "./components/SwarmPlot";
import { HeatMap } from "./components/HeatMap";
import { Radar } from "./components/Radar";

type TChartCardProps = PropsWithChildren & {
  flex?: number | string;
};

const ChartCard = ({ children, flex }: TChartCardProps) => {
  return (
    <Card sx={{ height: 400, flex, overflow: "visible" }}>
      <CardContent sx={{ height: "100%" }}>{children}</CardContent>
    </Card>
  );
};

export const Charts = () => {
  const view = useSelector((state) => state.global.view);

  if (view !== "chart") {
    return null;
  }

  return (
    <Stack>
      <Stack direction="row" gap={2} p={2} pb={0}>
        <ChartCard flex="35%">
          <TotalReviewHistory />
        </ChartCard>
        <ChartCard flex="40%">
          <ReviewCalendar />
        </ChartCard>
        {/* <ChartCard flex="15%">
          <CardTypeFunnel />
        </ChartCard> */}
      </Stack>
      <Stack direction="row" gap={2} p={2}>
        <ChartCard flex="20%">
          <HeatMap />
        </ChartCard>
        <ChartCard flex="20%">
          <Radar />
        </ChartCard>
        <ChartCard flex="50%">
          <SwarmPlot />
        </ChartCard>
      </Stack>
    </Stack>
  );
};
