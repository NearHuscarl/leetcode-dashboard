import Stack from "@mui/material/Stack";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./heatMapData";
import { HeatMapChart } from "./HeatMapChart";
import { HeatMapFilter } from "./HeatMapFilter";
import { useSelector } from "app/store/setup";

export const HeatMap = () => {
  const cards = useProblems();
  const date = useSelector((state) => state.filter.heatMap.date);
  const { data, totalReviews } = prepareChartData(cards, date);

  return (
    <Stack justifyContent="space-between" height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <div style={{ fontWeight: 500, fontSize: 19 }}>
          Reviews by time ({totalReviews})
        </div>
        <HeatMapFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <HeatMapChart data={data} />
    </Stack>
  );
};
