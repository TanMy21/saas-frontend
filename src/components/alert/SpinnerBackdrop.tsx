import {
  Backdrop,
  Box,
  CircularProgress,
  type Theme,
  Typography,
} from "@mui/material";

import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/typedReduxHooks";

const SpinnerBackdrop = () => {
  const { overlayOpen, overlayMessage } = useAppSelector(
    (state: RootState) => state.overlayUI
  );
  return (
    <Backdrop
      open={overlayOpen}
      sx={(t: Theme) => ({
        zIndex: t.zIndex.modal + 10, // sits above everything (menus/modals)
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.12)", // keep content visible underneath
        backdropFilter: "blur(1px)", // subtle blur so UI stays readable
      })}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CircularProgress size={36} />
        <Typography variant="body2">{overlayMessage || "Loading…"}</Typography>
      </Box>
    </Backdrop>
  );
};

export default SpinnerBackdrop;
