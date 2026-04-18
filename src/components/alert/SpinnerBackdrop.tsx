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
    (state: RootState) => state.overlayUI,
  );
  return (
    <Backdrop
      open={overlayOpen}
      sx={(t: Theme) => ({
        zIndex: t.zIndex.modal + 10,
        color: "#fff",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(6px)",
      })}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <CircularProgress size={48} />
        <Typography
          variant="body2"
          sx={{
            fontSize: "36px",
            fontWeight: 600,
            color: "#e2e8f0",
            letterSpacing: "0.2px",
          }}
        >
          {overlayMessage || "Loading…"}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default SpinnerBackdrop;
