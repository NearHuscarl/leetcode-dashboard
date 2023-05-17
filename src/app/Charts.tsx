import { PropsWithChildren } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { TotalReviewHistory } from "app/components/TotalReviewHistory";
import { RevisionCalendar } from "./components/RevisionCalendar";
import { useSelector } from "app/store/setup";

const ChartCard = ({ children }: PropsWithChildren) => {
  return (
    <Card sx={{ height: 400, width: "100%" }}>
      <CardContent sx={{ height: "100%" }}>{children}</CardContent>
    </Card>
  );
};

export const Charts = () => {
  const view = useSelector((state) => state.global.view);

  if (view !== "chart") {
    return null;
  }

  return (
    <Stack direction="row" gap={2} p={2}>
      <ChartCard>
        <TotalReviewHistory />
      </ChartCard>
      <ChartCard>
        <RevisionCalendar />
      </ChartCard>
    </Stack>
  );
};
