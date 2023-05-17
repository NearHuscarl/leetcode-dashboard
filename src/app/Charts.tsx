import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { ProblemHistoryChart } from "app/components/ProblemHistoryChart";
import { RevisionCalendar } from "./components/RevisionCalendar";
import { useSelector } from "app/store/setup";

export const Charts = () => {
  const view = useSelector((state) => state.global.view);

  if (view !== "chart") {
    return null;
  }

  return (
    <Stack direction="row" gap={2}>
      <Card sx={{ height: 400, width: "100%" }}>
        <ProblemHistoryChart />
      </Card>
      <Card sx={{ height: 400, width: "100%" }}>
        <RevisionCalendar />
      </Card>
    </Stack>
  );
};
