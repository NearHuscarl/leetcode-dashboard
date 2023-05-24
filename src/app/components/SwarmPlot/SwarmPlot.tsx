import Stack from "@mui/material/Stack";
import { useProblems } from "app/services/problems";
import { useSelector } from "app/store/setup";
import { SwarmPlotChart } from "./SwarmPlotChart";
import { prepareChartData } from "./swarmPlotData";
import { SwarmPlotFilter } from "./SwarmPlotFilter";
import { ChartTitle } from "../ChartTitle";

export const SwarmPlot = () => {
  const dateAgo = useSelector((state) => state.filter.swarmPlot.dateAgo);
  const cards = useProblems();
  const { data, types } = prepareChartData(cards, dateAgo);

  return (
    <Stack height="100%" justifyContent="space-between">
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
      <SwarmPlotChart data={data} groups={types} />
    </Stack>
  );
};
