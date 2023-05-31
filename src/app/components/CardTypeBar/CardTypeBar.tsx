import Stack from "@mui/material/Stack";
import { prepareChartData } from "./cardTypeBarData";
import { useProblems } from "app/services/problems";
import { ChartTitle } from "../ChartTitle";
import { CardTypeBarChart } from "./CardTypeBarChart";
import { CardTypeBarFilter } from "./CardTypeBarFilter";
import { useSelector } from "app/store/setup";

export const CardTypeBar = () => {
  const cards = useProblems();
  const dateView = useSelector((state) => state.filter.cardTypeBar.dateView);
  const { data } = prepareChartData(cards, dateView);

  return (
    <>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Card Types</ChartTitle>
        <CardTypeBarFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <CardTypeBarChart data={data} dateView={dateView} />
    </>
  );
};
