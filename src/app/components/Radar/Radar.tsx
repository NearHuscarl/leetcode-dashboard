import Stack from "@mui/material/Stack";
import { prepareChartData } from "./radarData";
import { useProblems } from "app/services/problems";
import { useLeetcodeProblems } from "app/api/leetcode";
import { ChartTitle } from "../ChartTitle";
import { RadarChart } from "./RadarChart";
import { RadarFilter } from "./RadarFilter";
import { useSelector } from "app/store/setup";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const Radar = () => {
  const cards = useProblems();
  const { data: leetcodes = {} } = useLeetcodeProblems();
  const dateAgo = useSelector((state) => state.filter.radar.dateAgo);
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
        <ChartTitle>Data Structures</ChartTitle>
        <RadarFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <ResponsiveContainer>
        <RadarChart data={data} />
      </ResponsiveContainer>
    </Stack>
  );
};
