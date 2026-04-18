import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { closeShareModal } from "../../app/slices/overlaySlice";
import { useTrackShareEventMutation } from "../../app/slices/surveysApiSlice";
import { useAppSelector } from "../../app/store";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { TabType } from "../../types/surveyBuilderTypes";
import { ShareSurveyProps } from "../../utils/types";
import ShareEmail from "../ModalComponents/ShareEmail";
import ShareEmbed from "../ModalComponents/ShareEmbed";
import ShareLink from "../ModalComponents/ShareLink";
import ShareModalTabs from "../ModalComponents/ShareModalTabs";

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
            py: 1.2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600} fontSize={20}>
            Share your survey
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>
          <ShareModalTabs tab={tab} setTab={setTab} />
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          {/* LINK TAB */}
          {tab === "link" && (
            <ShareLink
              shareURL={shareURL}
              shareID={shareID}
              surveyID={surveyID}
              title={title}
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
              title={title}
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
