import Stack from "@mui/material/Stack";
import { prepareChartData } from "./halfPieData";
import { useProblems } from "app/services/problems";
import { ChartTitle } from "../ChartTitle";
import { HalfPieChart } from "./HalfPieChart";

export const HalfPie = () => {
  const cards = useProblems();
  const { data } = prepareChartData(cards);

  return (
    <Stack justifyContent="space-between" height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Due Status</ChartTitle>
      </Stack>
      <HalfPieChart data={data} />
    </Stack>
  );
};
