import Box from "@mui/material/Box";
import { ChartView } from "./ChartView";
import { TableView } from "./TableView";
import { DetailDrawer } from "./components/DetailDrawer";

function App() {
  return (
    <Box sx={{ height: "95vh" }}>
      <ChartView />
      <TableView />
      <DetailDrawer />
    </Box>
  );
}

export default App;
