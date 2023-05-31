import { TWaffleDatum } from "./scatterPlotData";
import { TDueStatus } from "app/helpers/card";

const duePriority: Record<TDueStatus, number> = {
  stale: 0,
  bad: 1,
  now: 2,
  soon: 3,
  good: 4,
  safe: 5,
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
    <div style={{ width: 15, height: "100%" }}>
      {data.map((d, i) => {
        const { color, value } = d;

        return (
          <div
            style={{
              background: color[500],
              width: "100%",
              height: `${(value / total) * 100}%`,
              ...(i === 0
                ? {
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  }
                : {}),
              ...(i === data.length - 1
                ? {
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                  }
                : {}),
            }}
          />
        );
      })}
    </div>
  );
};
