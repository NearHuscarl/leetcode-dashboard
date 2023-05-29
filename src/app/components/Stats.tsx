import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import green from "@mui/material/colors/green";
import { Tooltip } from "@mui/material";

type TStatsProps = {
  label: string;
  value: number;
  total: number;
  change?: number;
  changeTooltip?: string;
};

export const Stats = (props: TStatsProps) => {
  const { label, value, total, change, changeTooltip } = props;
  const theme = useTheme();

  return (
    <div
      style={{
        fontWeight: "bold",
      }}
    >
      <div
        style={{
          color: theme.palette.grey[500],
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        {label}
      </div>
      <Stack direction="row" gap={1} alignItems="center">
        <div style={{ fontSize: 20 }}>
          {value}
          <span style={{ fontSize: 13, color: theme.palette.grey[500] }}>
            /{total}
          </span>
        </div>
        {change ? (
          <Tooltip title={changeTooltip}>
            <div
              style={{
                backgroundColor: green[50],
                color: green[600],
                padding: "2px 4px",
                fontWeight: 400,
                borderRadius: 4,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              +{change}
            </div>
          </Tooltip>
        ) : null}
      </Stack>
    </div>
  );
};
