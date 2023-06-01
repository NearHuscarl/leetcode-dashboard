import Stack from "@mui/material/Stack";
import { prepareChartData } from "./scatterPlotData";
import { useProblems } from "app/services/problems";
import { ChartTitle } from "../ChartTitle";
import { ScatterPlotChart } from "./ScatterPlotChart";
import { ScatterPlotFilter } from "./ScatterPlotFilter";
import { useSelector } from "app/store/setup";
import { ResponsiveContainer } from "../ResponsiveContainer";
import { DueStatusBar } from "./DueStatusBar";

export const ScatterPlot = () => {
  const cards = useProblems();
  const dateAgo = useSelector((state) => state.filter.scatterPlot.dateAgo);
  const { data, total } = prepareChartData(cards, dateAgo);

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
        <ScatterPlotFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <Stack direction="row" justifyContent="space-between" height="100%">
        <div style={{ flex: 1 }}>
          <ResponsiveContainer>
            <ScatterPlotChart data={data} />
          </ResponsiveContainer>
        </div>
        <div
          style={{
            flex: "0 0 50px",
            padding: 16,
            paddingBottom: 23,
            paddingRight: 0,
          }}
        >
          <ResponsiveContainer>
            <DueStatusBar data={total} />
          </ResponsiveContainer>
        </div>
      </Stack>
    </Stack>
  );
};
