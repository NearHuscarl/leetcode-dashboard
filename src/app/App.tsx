import { Box } from "@mui/material";
import { ProblemDataGrid } from "app/components/ProblemDataGrid";
import { ProblemHistoryChart } from "app/components/ProblemHistoryChart";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <SaveIcon />, name: "Save" },
];

function App() {
  const [isChart, setIsChart] = useState(false);

  return (
    <Box sx={{ height: "95vh" }}>
      <div
        style={{
          display: isChart ? "block" : "none",
          height: 500,
          width: 700,
        }}
      >
        <ProblemHistoryChart />
      </div>
      <div style={{ display: !isChart ? "inline" : "none" }}>
        <ProblemDataGrid />
      </div>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClick={() => setIsChart((c) => !c)}
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
