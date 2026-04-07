import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { CheckCircleIcon, CopyIcon, Loader } from "lucide-react";

import { useShareCopyHandler } from "../../hooks/useShareCopyHandler";
import { useTrackedEvent } from "../../hooks/useTrackedEvent";
import { ShareTabProps } from "../../types/surveyBuilderTypes";
import { getEmbedCode } from "../../utils/utils";

const ShareEmbed = ({
  shareURL,
  setOpenSnackbar,
  trackShareEvent,
  surveyID,
}: ShareTabProps) => {
  const track = useTrackedEvent(trackShareEvent, surveyID!);

  const { copy, status: copyStatus } = useShareCopyHandler(
    setOpenSnackbar,
    track,
  );

  const embedCode = getEmbedCode(shareURL);

  return (
    <Box>
      <Typography fontWeight={600} mb={1.5}>
        Embed code
      </Typography>

      <Box
        sx={{
          position: "relative",
          bgcolor: "#F3F4F6",
          p: 2,
          borderRadius: 2,
          fontFamily: "monospace",
          fontSize: 12,
          overflowX: "auto",
        }}
      >
        {embedCode}
        <Tooltip title={copyStatus === "copied" ? "Copied" : "Copy"}>
          <IconButton
            onClick={() => copy(embedCode, "embed", "SHARE_EMBED_CODE_COPIED")}
            disabled={!shareURL || copyStatus === "copying"}
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              bgcolor: "transparent",
              opacity: 0.8,
              "&:hover": {
                bgcolor: "#EEF2FF",
                borderColor: "#CBD5F5",
                opacity: 1,
              },
            }}
          >
            {copyStatus === "copying" ? (
              <Loader size={16} />
            ) : copyStatus === "copied" ? (
              <CheckCircleIcon size={18} color="green" />
            ) : (
              <CopyIcon size={18} color="black" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary" ml={1}>
          Paste into your website
        </Typography>
      </Box>
    </Box>
  );
};

export default ShareEmbed;
