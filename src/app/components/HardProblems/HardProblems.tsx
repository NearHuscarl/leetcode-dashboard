import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import TableViewIcon from "@mui/icons-material/TableView";
import { ChartTitle } from "../ChartTitle";
import { HardProblemTable } from "./HardProblemTable";
import { ResponsiveContainer } from "../ResponsiveContainer";
import { useDispatch } from "react-redux";
import { globalActions } from "app/store/globalSlice";

export const HardProblem = () => {
  const dispatch = useDispatch();

  return (
    <Stack justifyContent="space-between" height="100%" gap={2}>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Tooltip title="Problems with the lowest retention rates">
          <ChartTitle>Hard Problems</ChartTitle>
        </Tooltip>
        <IconButton
          color="primary"
          onClick={() => dispatch(globalActions.setTableView())}
        >
          <TableViewIcon />
        </IconButton>
      </Stack>
      <ResponsiveContainer>
        <HardProblemTable />
      </ResponsiveContainer>
    </Stack>
  );
};
