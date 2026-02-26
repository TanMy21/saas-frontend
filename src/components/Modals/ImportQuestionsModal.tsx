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
  onClose,
  setOpenImport,
}: ImportQuestionProps) => {
  const { surveyID } = useParams();
  const [importText, setImportText] = useState("");
  const [importBtnClicked, setImportBtnClicked] = useState(false);

  const [importQuestions, { isLoading }] = useImportQuestionsMutation();

  const handleClose = () => {
    onClose!();
    setOpenImport!(false);
    setImportBtnClicked(false);
  };

  return (
    <Modal
      open={isOpen!}
      onClose={onClose}
      aria-labelledby="Import questions modal"
      aria-describedby="Import questions to your survey by pasting them in the text area"
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
          borderRadius: "20px",
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
              height: "8%",
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
                marginTop: "2%",
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
                <CloseIcon sx={{ width: 28, height: 28 }} />
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
