import Stack from "@mui/material/Stack";
import { prepareChartData } from "./radarData";
import { useProblems } from "app/services/problems";
import { useLeetcodeProblems } from "app/api/leetcode";
import { ChartTitle } from "../ChartTitle";
import { RadarChart } from "./RadarChart";

export const Radar = () => {
  const cards = useProblems();
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const { data } = prepareChartData(cards, leetcodes);

  return (
    <Stack justifyContent="space-between" height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Data Structures</ChartTitle>
      </Stack>
      <RadarChart data={data} />
    </Stack>
  );
};
