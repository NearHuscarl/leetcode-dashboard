import LinearProgress from "@mui/material/LinearProgress";
import { alpha } from "@mui/system/colorManipulator";
import isNil from "lodash/isNil";
import red from "@mui/material/colors/red";
import yellow from "@mui/material/colors/yellow";
import green from "@mui/material/colors/green";
import { transform } from "framer-motion";

const getAcRateColor = transform(
  [30, 60, 80],
  [red[500], yellow[600], green[500]]
);

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
