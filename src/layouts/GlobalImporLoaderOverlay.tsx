import { Box, Typography } from "@mui/material";

import { useAppSelector } from "../app/typedReduxHooks";
import { ImportQuestionsLoader } from "../components/Loaders/ImportQuestionsLoader";

import GlobalSimpleLoader from "./GlobalSimpleLoader";

export const GlobalImportLoaderOverlay = () => {
  const { overlayOpen, overlayMessage, overlayVariant } = useAppSelector(
    (state) => state.overlayUI,
  );

  if (!overlayOpen) return null;

  if (overlayVariant === "SIMPLE") {
    return <GlobalSimpleLoader overlayMessage={overlayMessage} />;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImportQuestionsLoader slow={false} />

      {overlayMessage && (
        <Typography
          sx={{
            position: "absolute",
            bottom: "12%",
            fontSize: 16,
            color: "#374151",
          }}
        >
          {overlayMessage}
        </Typography>
      )}
    </Box>
  );
};
