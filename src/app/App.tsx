import Box from "@mui/material/Box";
import { ChartView } from "./ChartView";
import { TableView } from "./TableView";

function App() {
  return (
    <Box sx={{ height: "95vh" }}>
      <ChartView />
      <TableView />
    </Box>
  );
}

export default App;
