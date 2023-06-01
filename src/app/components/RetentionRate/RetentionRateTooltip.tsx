import { ReactElement } from "react";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";
import grey from "@mui/material/colors/grey";
import startCase from "lodash/startCase";
import { ChartTooltip } from "../ChartTooltip";
import { TEaseLabel } from "app/helpers/card";

const easePriorities = {
  easy: 0,
  good: 1,
  hard: 2,
  again: 3,
};

interface TCustomTooltipProps {
  cardType: string;
  result: Record<string, number>;
}

const CustomTooltip = (props: TCustomTooltipProps) => {
  const { result, cardType } = props;
  const total = Object.keys(result).reduce((acc, key) => acc + result[key], 0);
  const theme = useTheme();

  return (
    <ChartTooltip>
      <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
        {cardType}
      </div>
      {Object.keys(result)
        .filter((r) => r !== "unknown")
        // @ts-ignore
        .sort((a, b) => easePriorities[a] - easePriorities[b])
        .map((ease) => (
          <Stack
            key={ease}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            <ChartTooltip.Text
              style={{
                color:
                  ease === "again"
                    ? grey[400]
                    : theme.anki.ease[ease as TEaseLabel],
                width: 60,
              }}
            >
              {startCase(ease)}
            </ChartTooltip.Text>
            <ChartTooltip.Number style={{ flex: 1 }}>
              {result[ease]}
            </ChartTooltip.Number>
            <ChartTooltip.Text style={{ width: 40, textAlign: "right" }}>
              {((result[ease] / (total || 1)) * 100).toFixed(1)}
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

interface TRetentionRateTooltipProps extends TCustomTooltipProps {
  children: ReactElement;
}

export const RetentionRateTooltip = (props: TRetentionRateTooltipProps) => {
  const { children, ...rest } = props;

  return (
    <TootlipWrapper
      title={<CustomTooltip {...rest} />}
      followCursor
      placement="top"
    >
      {children}
    </TootlipWrapper>
  );
};
