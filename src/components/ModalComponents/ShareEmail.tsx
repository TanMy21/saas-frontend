import { useEffect, useRef, useState } from "react";

import { Box, Typography } from "@mui/material";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import { ShareTabProps } from "../../types/surveyBuilderTypes";
import { getSurveyEmailTemplate } from "../../utils/emailTemplate";
import { safeCopyText } from "../../utils/utils";

const ShareEmail = ({
  title,
  shareURL,
  setOpenSnackbar,
  trackShareEvent,
}: ShareTabProps) => {
  const { surveyID } = useParams();
  const [_loadingKey, setLoadingKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCopied = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setCopied(key);
    setOpenSnackbar(true);

    timeoutRef.current = setTimeout(() => setCopied(null), 2000);
  };

  const handleCopy = async (value: string, key: string) => {
    if (!value) return;

    setLoadingKey(key);
    const success = await safeCopyText(value);
    setLoadingKey(null);

    if (!success) {
      console.error("Copy failed");
      return;
    }

    triggerCopied(key);
    trackShareEvent({
      surveyID: surveyID!,
      actionType: "SHARE_LINK_COPIED",
    });
  };

  const copyRichText = async (html: string) => {
    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard not supported");
      }

      // Convert HTML to plain text fallback
      const temp = document.createElement("div");
      temp.innerHTML = html;
      const plainText = temp.innerText;

      const item = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([plainText], { type: "text/plain" }), // 🔥 KEY FIX
      });

      await navigator.clipboard.write([item]);

      triggerCopied("template");
      trackShareEvent({
        surveyID: surveyID!,
        actionType: "SHARE_EMAIL_TEMPLATE_COPIED",
      });
    } catch (err) {
      console.error("Rich copy failed, fallback to text", err);

      // fallback
      await safeCopyText(html);
      triggerCopied("template");
      trackShareEvent({
        surveyID: surveyID!,
        actionType: "SHARE_EMAIL_TEMPLATE_COPIED",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        onClick={() =>
          copyRichText(
            getSurveyEmailTemplate({
              surveyTitle: title,
              shareURL,
              senderName: "<Your Name>",
            }),
          )
        }
        sx={{
          position: "relative",
          p: 2.5,
          border: "1px solid #E5E7EB",
          borderRadius: 2.5,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#6366F1",
            bgcolor: "#F8FAFF",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {/* Top-right icon */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: copied === "template" ? "success.main" : "#9CA3AF",
          }}
        >
          {copied === "template" ? (
            <CheckIcon size={20} />
          ) : (
            <CopyIcon size={20} />
          )}
        </Box>

        {/* Content */}
        <Typography fontWeight={600} mb={0.5}>
          Email Template
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Copy a ready-to-send email with your survey link
        </Typography>
      </Box>

      {/* Survey Link Card */}
      <Box
        onClick={() => handleCopy(shareURL, "email_link")}
        sx={{
          position: "relative",
          p: 2.5,
          border: "1px solid #E5E7EB",
          borderRadius: 2.5,
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#6366F1",
            bgcolor: "#F8FAFF",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {/* Top-right icon */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: copied === "email_link" ? "success.main" : "#9CA3AF",
          }}
        >
          {copied === "email_link" ? (
            <CheckIcon size={20} />
          ) : (
            <LinkIcon size={20} />
          )}
        </Box>

        {/* Content */}
        <Typography fontWeight={600} mb={0.5}>
          Survey Link
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Copy just the link to share anywhere
        </Typography>
      </Box>
    </Box>
  );
};

export default ShareEmail;
