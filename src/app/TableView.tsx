import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { ProblemDataGrid } from "app/components/ProblemDataGrid";
import { useSelector } from "app/store/setup";
import { globalActions } from "./store/globalSlice";

export const TableView = () => {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.global.view);

  if (view !== "table") {
    return null;
  }

  return (
    <>
      <Button
        startIcon={<KeyboardBackspaceIcon fontSize="small" />}
        onClick={() => dispatch(globalActions.setChartView())}
      >
        View Charts
      </Button>
      <ProblemDataGrid />
    </>
  );
};
