import { CSSProperties, PropsWithChildren } from "react";
import Card from "@mui/material/Card";
import grey from "@mui/material/colors/grey";

type TChartTooltipProps = PropsWithChildren<{}> & {};

export const ChartTooltip = ({ children }: TChartTooltipProps) => {
  return <Card sx={{ p: 1.5 }}>{children}</Card>;
};

type TCommonProps = PropsWithChildren & {
  style?: CSSProperties;
};

ChartTooltip.Date = ({ children, style }: TCommonProps) => {
  return (
    <div style={{ color: grey[500], fontWeight: 500, fontSize: 14, ...style }}>
      {children}
    </div>
  );
};

ChartTooltip.Text = ({ children, style }: TCommonProps) => {
  return <div style={{ fontSize: 12, ...style }}>{children}</div>;
};

type TNumberProps = {
  dimZero?: boolean;
  style?: CSSProperties;
  children?: number | null;
};

ChartTooltip.Number = ({ children, style, dimZero = false }: TNumberProps) => {
  return (
    <span
      style={{
        textAlign: "right",
        fontSize: 12,
        fontWeight: 600,
        color: dimZero ? (children === 0 ? grey[400] : "inherit") : "inherit",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

ChartTooltip.Unit = ({ children, style }: TCommonProps) => {
  return (
    <span style={{ fontSize: 12, color: grey[400], ...style }}>{children}</span>
  );
};

ChartTooltip.Caption = ({ children, style }: TCommonProps) => {
  return <div style={{ fontSize: 11, ...style }}>{children}</div>;
};
