import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, IconButton, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { useImportQuestionsMutation } from "../../app/slices/elementApiSlice";
import { ImportQuestionProps } from "../../utils/types";
import ImportQuestionsLoader from "../Loaders/ImportQuestionsLoader";

import ImportQuestionModalInputField from "./ImportQuestionModalInputField";

const ImportQuestionsModal = ({
  isOpen,
  openImport,
  setOpenImport,
}: ImportQuestionProps) => {
  const { surveyID } = useParams();
  const [open, setOpen] = useState(isOpen);
  const [importText, setImportText] = useState("");
  const [importBtnClicked, setImportBtnClicked] = useState(false);

  const [importQuestions, { isLoading }] = useImportQuestionsMutation();

  const handleClose = () => {
    setOpen(false);
    setOpenImport!(false);
    setImportBtnClicked(false);
  };

  return (
    <Modal
      open={Boolean(open) || Boolean(openImport)}
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
          width: 800,
          height: 680,
          bgcolor: "#FAFAFA",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            margin: "auto",
            width: "100%",
            height: "100%",
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
              Import questions
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "8%",
                height: "92%",
                marginRight: "2%",
                marginTop: "4px",
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
              width: "98%",
              height: "88%",
              justifyContent: "space-between",
              p: 1,
              // border: "2px solid red",
            }}
          >
            {importBtnClicked && importText.trim().length === 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                You need to add some questions before importing
              </Alert>
            )}
            {isLoading ? (
              <ImportQuestionsLoader />
            ) : (
              <ImportQuestionModalInputField
                importQuestions={importQuestions}
                surveyID={surveyID!}
                isLoading={isLoading}
                importText={importText}
                setImportText={setImportText}
                setImportBtnClicked={setImportBtnClicked}
                handleClose={handleClose}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportQuestionsModal;
