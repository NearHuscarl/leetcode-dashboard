import Stack from "@mui/material/Stack";
import { prepareChartData } from "./halfPieData";
import { useProblems } from "app/services/problems";
import { ChartTitle } from "../ChartTitle";
import { HalfPieChart } from "./HalfPieChart";
import { HalfPieFilter } from "./HalfPieFilter";
import { useSelector } from "app/store/setup";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const HalfPie = () => {
  const cards = useProblems();
  const dateAgo = useSelector((state) => state.filter.halfPie.dateAgo);
  const { data } = prepareChartData(cards, dateAgo);

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
        <HalfPieFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <ResponsiveContainer>
        <HalfPieChart data={data} />
      </ResponsiveContainer>
    </Stack>
  );
};
