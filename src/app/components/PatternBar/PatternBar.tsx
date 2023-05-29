import Stack from "@mui/material/Stack";
import { prepareChartData } from "./patternBarData";
import { useProblems } from "app/services/problems";
import { useLeetcodeProblems } from "app/api/leetcode";
import { ChartTitle } from "../ChartTitle";
import { PatternBarFilter } from "./PatternBarFilter";
import { useSelector } from "app/store/setup";
import { PatternBarChart } from "./PatternBarChart";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const PatternBar = () => {
  const cards = useProblems();
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const dateAgo = useSelector((state) => state.filter.patternBar.dateAgo);
  const { data } = prepareChartData(cards, leetcodes, dateAgo);

  return (
    <Stack justifyContent="space-between" height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Patterns Covered</ChartTitle>
        <PatternBarFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <ResponsiveContainer>
        <PatternBarChart data={data} />
      </ResponsiveContainer>
    </Stack>
  );
};
