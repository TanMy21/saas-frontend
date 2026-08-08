import { Box, IconButton, Paper } from "@mui/material";
import { CiMobile3, CiMonitor } from "react-icons/ci";

import { setCanvasView } from "../../../../app/slices/surveyCanvasSlice";
import { RootState } from "../../../../app/store";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../app/typedReduxHooks";
import { useAppTheme } from "../../../../theme/useAppTheme";

const FontSizeViewToggle = () => {
  const dispatch = useAppDispatch();

  const toggleView = useAppSelector(
    (state: RootState) => state.surveyCanvas.view,
  );

  const { primary, grey } = useAppTheme();

  return (
    <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
          height: "36px",
          p: 0.5,
          backgroundColor: grey[100],
        }}
      >
        <IconButton
          onClick={() => {
            dispatch(setCanvasView("desktop"));
          }}
          title="Desktop font size"
          sx={{
            p: 1,
            borderRadius: 1,
            transition: "all 0.2s",
            color: toggleView === "desktop" ? primary.main : grey[700],
            backgroundColor: toggleView === "desktop" ? "white" : "transparent",
            boxShadow: toggleView === "desktop" ? 1 : "none",
            "&:hover": {
              color: toggleView === "desktop" ? primary.main : grey[700],
            },
          }}
        >
          <CiMonitor style={{ fontSize: "20px" }} />
        </IconButton>

        <IconButton
          onClick={() => {
            dispatch(setCanvasView("mobile"));
          }}
          title="Mobile font size"
          sx={{
            p: 1,
            borderRadius: 1,
            transition: "all 0.2s",
            color: toggleView === "mobile" ? primary.main : grey[700],
            backgroundColor: toggleView === "mobile" ? "white" : "transparent",
            boxShadow: toggleView === "mobile" ? 1 : "none",
            "&:hover": {
              color: toggleView === "mobile" ? primary.main : grey[700],
            },
          }}
        >
          <CiMobile3 style={{ fontSize: "20px" }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default FontSizeViewToggle;
