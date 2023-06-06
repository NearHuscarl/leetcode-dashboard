import Box from "@mui/material/Box";
import { ChartView } from "./ChartView";
import { TableView } from "./TableView";
import { Drawer } from "./components/Drawer";

function App() {
  return (
    <Box sx={{ height: "95vh" }}>
      <ChartView />
      <TableView />
      <Drawer />
    </Box>
  );
}

export default App;
