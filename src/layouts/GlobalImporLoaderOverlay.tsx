import { lazy, Suspense } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { useAppSelector } from "../app/typedReduxHooks";

import GlobalSimpleLoader from "./GlobalSimpleLoader";

const ImportQuestionsLoader = lazy(() =>
  import("../components/Loaders/ImportQuestionsLoader").then((module) => ({
    default: module.ImportQuestionsLoader,
  })),
);

export const GlobalImportLoaderOverlay = () => {
  const { overlayOpen, overlayMessage, overlayVariant } = useAppSelector(
    (state) => state.overlayUI,
  );

  if (!overlayOpen) return null;

  if (overlayVariant === "SIMPLE") {
    return <GlobalSimpleLoader overlayMessage={overlayMessage} />;
  }

  if (overlayVariant !== "IMPORT") return null;

  return (
    <Box component="div"
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
      <Suspense fallback={<CircularProgress size={40} />}>
        <ImportQuestionsLoader slow={false} />
      </Suspense>

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
