import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { GenerateSurveyModalProps } from "../../utils/types";

import GenerateSurveyForm from "./GenerateSurveyForm";

export interface GenerateSurveyFormRef {
  submit: () => void;
}

const GenerateSurveyModal = ({
  openGenerate,
  setOpenGenerate,
}: GenerateSurveyModalProps) => {
  const { surveyID } = useParams();
  const [open, setOpen] = useState(openGenerate);

  const handleClose = () => {
    setOpen(false);
    setOpenGenerate?.(false);
  };

  return (
    <Modal
      open={Boolean(open) || Boolean(openGenerate)}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "#FAFAFA",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "100%",
            height: 720,
            // border: "2px solid blue",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "6%",
              justifyContent: "space-between",
              p: 1,
              // border: "2px solid red",
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "1%",
                marginLeft: "2%",
              }}
            >
              Generate Questions
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "8%",
                height: "92%",
                marginRight: "2%",
                marginTop: "2px",
                // border: "2px solid green",
              }}
            >
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "92%",
              // border: "2px solid red",
            }}
          >
            <GenerateSurveyForm surveyID={surveyID!} setOpen={setOpen} handleClose={handleClose}/>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default GenerateSurveyModal;
