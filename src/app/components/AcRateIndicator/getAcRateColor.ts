import { transform } from "framer-motion";
import red from "@mui/material/colors/red";
import yellow from "@mui/material/colors/yellow";
import green from "@mui/material/colors/green";

export const getAcRateColor = transform(
  [30, 60, 80],
  [red[500], yellow[600], green[500]]
);
