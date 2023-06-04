import red from "@mui/material/colors/red";
import orange from "@mui/material/colors/orange";
import yellow from "@mui/material/colors/yellow";
import lightGreen from "@mui/material/colors/lightGreen";
import grey from "@mui/material/colors/grey";
import { TEaseLabel } from "app/helpers/card";

const reviewResultColors: Record<TEaseLabel, string> = {
  easy: lightGreen[500],
  good: yellow[500],
  hard: orange[500],
  again: red[500],
  unknown: grey[300],
};

export const ReviewDot = ({ result }: { result: TEaseLabel }) => {
  return (
    <div
      title={result}
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: reviewResultColors[result],
      }}
    />
  );
};
