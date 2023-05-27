import Stack from "@mui/material/Stack";
import { useProblems } from "app/services/problems";
import { useSelector } from "app/store/setup";
import { SwarmPlotChart } from "./SwarmPlotChart";
import { prepareChartData } from "./swarmPlotData";
import { SwarmPlotFilter } from "./SwarmPlotFilter";
import { ChartTitle } from "../ChartTitle";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const SwarmPlot = () => {
  const dateAgo = useSelector((state) => state.filter.swarmPlot.dateAgo);
  const cards = useProblems();
  const { data, types } = prepareChartData(cards, dateAgo);

  return (
    <Stack height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Ease Rate</ChartTitle>
        <SwarmPlotFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <ResponsiveContainer>
        <SwarmPlotChart data={data} groups={types} />
      </ResponsiveContainer>
    </Stack>
  );
};
