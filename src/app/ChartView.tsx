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
import { ScatterPlot } from "./components/ScatterPlot";
import { CardTypeBar } from "./components/CardTypeBar";
import { useTheme } from "@mui/material";
import { RetentionRate } from "./components/RetentionRate";
import { HardProblem } from "./components/HardProblems";
import { PatternBar } from "./components/PatternBar";

type TChartCardProps = PropsWithChildren & {
  flex?: number | string;
};

const ChartCard = ({ children, flex }: TChartCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: `calc(98vh / 3 - ${theme.spacing(2)})`,
        flex,
        overflow: "visible",
        "& .MuiCardContent-root": {
          pb: theme.spacing(2) + " !important",
        },
      }}
    >
      <CardContent sx={{ height: "100%" }}>{children}</CardContent>
    </Card>
  );
};

export const ChartView = () => {
  const view = useSelector((state) => state.global.view);

  if (view !== "chart") {
    return null;
  }

  return (
    <Stack height="100vh" justifyContent="stretch" overflow="hidden">
      <Stack flex={1} direction="row" gap={2} p={2} pb={0}>
        <ChartCard flex="1.25">
          <TotalReviewHistory />
        </ChartCard>
        <ChartCard flex="1">
          <ReviewCalendar />
        </ChartCard>
        <ChartCard flex=".75">
          <CardTypeBar />
        </ChartCard>
      </Stack>
      <Stack flex={1} direction="row" gap={2} p={2} pb={0}>
        <ChartCard flex="0 0 450px">
          <RetentionRate />
        </ChartCard>
        <ChartCard flex="40%">
          <ScatterPlot />
        </ChartCard>
        <ChartCard flex="0 0 300px">
          <Radar />
        </ChartCard>
        <ChartCard flex="0 0 350px">
          <HardProblem />
        </ChartCard>
      </Stack>
      <Stack flex={1} direction="row" gap={2} p={2}>
        <ChartCard flex="0 0 350px">
          <HeatMap />
        </ChartCard>
        <ChartCard flex="1.5">
          <PatternBar />
        </ChartCard>
        <ChartCard flex="1">
          <SwarmPlot />
        </ChartCard>
      </Stack>
    </Stack>
  );
};
