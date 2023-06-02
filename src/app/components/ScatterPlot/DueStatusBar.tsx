import Stack from "@mui/material/Stack";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import styled from "@mui/material/styles/styled";
import startCase from "lodash/startCase";
import { TWaffleDatum } from "./scatterPlotData";
import { TDueStatus } from "app/helpers/card";
import { ChartTooltip } from "../ChartTooltip";

interface TCustomTooltipProps {
  data: TWaffleDatum[];
  total: number;
}

const CustomTooltip = (props: TCustomTooltipProps) => {
  const { data, total } = props;

  return (
    <ChartTooltip>
      {data
        .filter((d) => d.id !== "none")
        .map(({ id, color, value }) => (
          <Stack
            key={id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            <ChartTooltip.Text style={{ color: color[500], width: 60 }}>
              {startCase(id)}
            </ChartTooltip.Text>
            <ChartTooltip.Number style={{ flex: 1 }}>
              {value}
            </ChartTooltip.Number>
            <ChartTooltip.Text style={{ width: 40, textAlign: "right" }}>
              {((value / (total || 1)) * 100).toFixed(1)}
              <ChartTooltip.Unit>%</ChartTooltip.Unit>
            </ChartTooltip.Text>
          </Stack>
        ))}
    </ChartTooltip>
  );
};

const TootlipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
    fontWeight: 400,
    padding: 0,
  },
});

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

export const DueStatusBar = (props: TDueStatusWaffleProps) => {
  const { data } = props;
  const total = data
    // @ts-ignore
    .sort((a, b) => duePriority[a.id] - duePriority[b.id])
    .reverse()
    .reduce((acc, cur) => acc + cur.value, 0);

  return (
    <TootlipWrapper
      followCursor
      placement="top"
      title={<CustomTooltip data={data} total={total} />}
    >
      <div style={{ width: 15, height: "100%" }}>
        {data.map((d, i) => {
          const { id, color, value } = d;

          return (
            <div
              key={id}
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
    </TootlipWrapper>
  );
};
