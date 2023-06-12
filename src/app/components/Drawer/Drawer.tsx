import { useDispatch } from "react-redux";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useSelector } from "app/store/setup";
import { globalActions } from "app/store/globalSlice";
import { DrawerDetail } from "./DrawerDetail";
import { DrawerProblems } from "./DrawerProblems";
import { ReactNode } from "react";

const Layer = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "white",
        left: 0,
        top: 0,
        p: 3,
        // put this layer above the empty row Overlay of the DataGrid
        zIndex: 4,
      }}
    >
      {children}
    </Box>
  );
};

export const Drawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.global.drawer.open);
  const detailId = useSelector((state) => state.global.drawer.problemDetailId);
  const problemIds = useSelector((state) => state.global.drawer.problemIds);
  const anchor = "left";

  return (
    <MuiDrawer
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
      slotProps={{
        backdrop: {
          invisible: true,
        },
      }}
      anchor={anchor}
      open={isOpen}
      onClose={() => dispatch(globalActions.setDrawerOpen(false))}
    >
      <Box
        sx={{ width: 700, height: "100%", position: "relative" }}
        role="presentation"
      >
        <Layer>
          <DrawerProblems leetcodeIds={problemIds} />
        </Layer>
        {detailId && (
          <Layer>
            <DrawerDetail leetcodeId={detailId} />
          </Layer>
        )}
      </Box>
    </MuiDrawer>
  );
};
