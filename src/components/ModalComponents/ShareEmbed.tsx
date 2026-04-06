import { useEffect, useMemo, useRef, useState } from "react";

import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { CheckCircleIcon, CopyIcon, Loader } from "lucide-react";
import { useParams } from "react-router-dom";

import { ShareTabProps } from "../../types/surveyBuilderTypes";
import { safeCopyText } from "../../utils/utils";

const ShareEmbed = ({
  shareURL,
  setOpenSnackbar,
  trackShareEvent,
}: ShareTabProps) => {
  const { surveyID } = useParams();
  const [_loadingKey, setLoadingKey] = useState<string | null>(null);
  const [_copied, setCopied] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied">(
    "idle",
  );

  const embedCode = useMemo(
    () =>
      `<iframe src="${shareURL}?embed=true" width="100%" height="600" style="border:none;border-radius:8px;"></iframe>`,
    [shareURL],
  );

  const triggerCopied = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setCopied(key);
    setOpenSnackbar(true);

    timeoutRef.current = setTimeout(() => setCopied(null), 2000);
  };

  const handleCopy = async (value: string, key: string) => {
    if (!value) return;

    setLoadingKey(key);
    setCopyStatus("copying");
    const success = await safeCopyText(value);
    setLoadingKey(null);

    if (!success) {
      console.error("Copy failed");
      setCopyStatus("idle");
      return;
    }

    triggerCopied(key);
    setCopyStatus("copied");
    trackShareEvent({
      surveyID: surveyID!,
      actionType: "SHARE_EMBED_CODE_COPIED",
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCopyStatus("idle");
      setCopied(null);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
            onClick={() => handleCopy(embedCode, "embed")}
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
