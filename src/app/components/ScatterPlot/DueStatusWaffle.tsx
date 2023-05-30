import { TWaffleDatum } from "./scatterPlotData";
import { TDueStatus } from "app/helpers/card";
import { grey } from "@mui/material/colors";

const duePriority: Record<TDueStatus, number> = {
  stale: 0,
  bad: 1,
  now: 2,
  good: 3,
  none: -1,
};

type TDueStatusWaffleProps = {
  data: TWaffleDatum[];
};

export const DueStatusWaffle = (props: TDueStatusWaffleProps) => {
  const { data } = props;
  const total = data
    // @ts-ignore
    .sort((a, b) => duePriority[a.id] - duePriority[b.id])
    .reverse()
    .reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div
      style={{
        width: 15,
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: grey[300],
      }}
    >
      {data.map((d) => {
        const { color } = d;

        return (
          <div
            style={{
              bottom: 0,
              left: 0,
              width: "100%",
              borderRadius: 1,
              background: color[500],
              height: `${(d.value / total) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
};
