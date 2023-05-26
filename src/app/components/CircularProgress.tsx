import MuiCircularProgress from "@mui/material/CircularProgress";
import grey from "@mui/material/colors/grey";

type TCircularProgressProps = {
  values: { value: number; color: string }[];
  value: number;
  text: string;
};

export const CircularProgress = (props: TCircularProgressProps) => {
  const { values, value, text } = props;
  const thickness = 6;
  const size = 120;
  const total = values.reduce((a, b) => a + b.value, 0);
  const prefixSums = values.reduce((a, b, i) => {
    a[i] = (a[i - 1] || 0) + b.value;
    return a;
  }, [] as number[]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        width: "min-content",
      }}
    >
      <MuiCircularProgress
        thickness={thickness}
        size={size}
        variant="determinate"
        value={100}
        sx={{
          circle: {
            stroke: grey[200],
          },
        }}
      />
      {values.map(({ value, color }, i) => {
        return (
          <MuiCircularProgress
            thickness={thickness}
            size={size}
            variant="determinate"
            value={(value / total) * 100}
            sx={{
              top: 0,
              left: 0,
              position: "absolute",
              transform: `rotate(${
                -90 + (360 * (prefixSums[i] - value)) / total
              }deg) !important`,
              circle: {
                stroke: color,
              },
            }}
          />
        );
      })}
      <div
        style={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: 24,
              lineHeight: "20px",
            }}
          >{`${Math.round(value * 100)}%`}</div>
          <div style={{ fontSize: 12 }}>{text}</div>
        </div>
      </div>
    </div>
  );
};
