import { useDispatch } from "react-redux";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useSelector } from "app/store/setup";
import { globalActions } from "app/store/globalSlice";
import { DrawerDetail } from "./DrawerDetail";
import { DrawerProblems } from "./DrawerProblems";

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
      <Box sx={{ width: 700, height: "100%", p: 3 }} role="presentation">
        {detailId ? (
          <DrawerDetail leetcodeId={detailId} />
        ) : (
          <DrawerProblems leetcodeIds={problemIds} />
        )}
      </Box>
    </MuiDrawer>
  );
};
