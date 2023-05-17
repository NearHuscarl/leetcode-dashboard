import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Box from "@mui/material/Box";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import { ProblemDataGrid } from "app/components/ProblemDataGrid";
import { Charts } from "./Charts";
import { globalActions } from "./store/globalSlice";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
];

function App() {
  const dispatch = useDispatch();

  return (
    <Box sx={{ height: "95vh" }}>
      <Charts />
      <ProblemDataGrid />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={() => dispatch(globalActions.toggleView())}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default App;
