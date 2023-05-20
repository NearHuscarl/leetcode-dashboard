import LinearProgress from "@mui/material/LinearProgress";
import { alpha } from "@mui/system/colorManipulator";
import isNil from "lodash/isNil";
import { getAcRateColor } from "./getAcRateColor";

type TAcRateIndicatorProps = {
  value?: number;
  width?: number | string;
  height?: number | string;
};

export const AcRateIndicator = (props: TAcRateIndicatorProps) => {
  const { value, width = "100%", height = 10 } = props;
  if (isNil(value)) return null;

  return (
    <LinearProgress
      variant="determinate"
      sx={{
        width,
        height,
        borderRadius: 3,
        backgroundColor: alpha(getAcRateColor(value), 0.2),
        "& > span": {
          backgroundColor: getAcRateColor(value),
        },
      }}
      value={value}
    />
  );
};
