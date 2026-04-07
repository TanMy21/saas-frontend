import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Tab, Tabs, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { closeShareModal } from "../../app/slices/overlaySlice";
import { useTrackShareEventMutation } from "../../app/slices/surveysApiSlice";
import { useAppSelector } from "../../app/store";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { ShareSurveyProps } from "../../utils/types";
import ShareEmail from "../ModalComponents/ShareEmail";
import ShareEmbed from "../ModalComponents/ShareEmbed";
import ShareLink from "../ModalComponents/ShareLink";

const ShareSurveyModal = ({
  setShareBtnSelected,
  setOpenSnackbar,
  shareID,
  title,
}: ShareSurveyProps) => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.overlayUI.shareModalOpen);

  const [trackShareEvent] = useTrackShareEventMutation();

  type TabType = "link" | "email" | "embed";
  const [tab, setTab] = useState<TabType>("link");

  const shareBaseURL = import.meta.env.VITE_SHARE_BASE_URL || "";
  const shareURL = shareBaseURL
    ? `${shareBaseURL.replace(/\/$/, "")}/${shareID}`
    : "";

  const handleClose = () => {
    setShareBtnSelected(false);
    dispatch(closeShareModal());
  };

  return (
    <Modal open={Boolean(open)} onClose={handleClose}>
      <Box
        sx={{
          maxWidth: 520,
          mx: "auto",
          mt: 10,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600}>Share your survey</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* TABS   */}
        <Tabs
          value={tab}
          onChange={(_, val: TabType) => setTab(val)}
          sx={{
            px: 2,
            minHeight: 40,
            borderBottom: "1px solid #eee",
            "& .MuiTabs-flexContainer": { gap: 2.5 },
            "& .MuiTabs-indicator": { height: 2, bottom: 1 },
          }}
        >
          <Tab label="Link" value="link" />
          <Tab label="Email" value="email" />
          <Tab label="Embed" value="embed" />
        </Tabs>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          {/* LINK TAB */}
          {tab === "link" && (
            <ShareLink
              shareURL={shareURL}
              shareID={shareID}
              surveyID={surveyID}
              setOpenSnackbar={setOpenSnackbar}
              trackShareEvent={trackShareEvent}
            />
          )}

          {/* EMAIL TAB */}
          {tab === "email" && (
            <ShareEmail
              title={title}
              shareURL={shareURL}
              surveyID={surveyID}
              setOpenSnackbar={setOpenSnackbar}
              trackShareEvent={trackShareEvent}
            />
          )}

          {/* EMBED TAB */}
          {tab === "embed" && (
            <ShareEmbed
              shareURL={shareURL}
              surveyID={surveyID}
              setOpenSnackbar={setOpenSnackbar}
              trackShareEvent={trackShareEvent}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};
export default ShareSurveyModal;
