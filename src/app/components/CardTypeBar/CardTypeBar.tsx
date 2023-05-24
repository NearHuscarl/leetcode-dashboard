import Stack from "@mui/material/Stack";
import { prepareChartData } from "./cardTypeBarData";
import { useProblems } from "app/services/problems";
import { ChartTitle } from "../ChartTitle";
import { CardTypeBarChart } from "./CardTypeBarChart";

export const CardTypeBar = () => {
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
        <ChartTitle>Card Types</ChartTitle>
      </Stack>
      <CardTypeBarChart data={data} />
    </Stack>
  );
};
