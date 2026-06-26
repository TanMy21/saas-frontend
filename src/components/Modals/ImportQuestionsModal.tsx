import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, IconButton, Modal, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import {
  useGetElementsForSurveyQuery,
  useGetQuestionImportJobStatusQuery,
  useImportQuestionsMutation,
} from "../../app/slices/elementApiSlice";
import { setAiQuestionsJustAdded } from "../../app/slices/generateSurveyQuestionSlice";
import { hideOverlay, showOverlay } from "../../app/slices/overlaySlice";
import { useAppDispatch } from "../../app/typedReduxHooks";
import { useSurveyCanvasRefetch } from "../../context/BuilderRefetchCanvas";
import { useToast } from "../../hooks/useToast";
import { nonOrderableTypes } from "../../utils/constants";
import { showToast } from "../../utils/showToast";
import { ImportQuestionProps } from "../../utils/types";
import { getEmptyTextMessage } from "../../utils/utils";

import ImportQuestionModalInputField from "./ImportQuestionModalInputField";

const ImportQuestionsModal = ({
  isOpen,
  onClose,
  setOpenImport,
}: ImportQuestionProps) => {
  const { surveyID } = useParams();
  const dispatch = useAppDispatch();
  const refetchCanvas = useSurveyCanvasRefetch();

  const [importJobID, setImportJobID] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [importBtnClicked, setImportBtnClicked] = useState(false);
  const [attemptedMode, setAttemptedMode] = useState<
    "INITIAL" | "APPEND" | "REPLACE" | null
  >(null);

  const { data: elements = [], refetch: refetchElements } =
    useGetElementsForSurveyQuery(surveyID!);

  const existingQuestionsCount = elements.filter(
    (el) => el.type && !nonOrderableTypes.includes(el.type),
  ).length;

  const [importQuestions, { isLoading }] = useImportQuestionsMutation();

  const {
    data: importJob,
    isError: isImportJobError,
    error: importJobError,
  } = useGetQuestionImportJobStatusQuery(importJobID!, {
    skip: !importJobID,
    pollingInterval: importJobID ? 2000 : 0,
  });

  const handleClose = () => {
    onClose?.();
    setOpenImport?.(false);
    setImportBtnClicked(false);
  };

  useToast({
    isError: isImportJobError,
    error: importJobError,
  });

  useEffect(() => {
    if (!importJob) return;

    if (importJob.status === "PENDING" || importJob.status === "PROCESSING") {
      return;
    }

    if (importJob.status === "COMPLETED") {
      dispatch(
        showOverlay({
          message: "Finalizing your survey...",
          variant: "IMPORT",
        }),
      );

      dispatch(setAiQuestionsJustAdded());

      setImportText("");
      void refetchElements();
      refetchCanvas();

      showToast.success("Questions imported successfully.");

      setImportJobID(null);
      dispatch(hideOverlay());
      return;
    }

    if (
      importJob.status === "FAILED" ||
      importJob.status === "TIMED_OUT" ||
      importJob.status === "CANCELED"
    ) {
      showToast.error(importJob.errorMessage || "Failed to import questions.");

      setImportJobID(null);
      dispatch(hideOverlay());
    }
  }, [importJob, dispatch, refetchCanvas, refetchElements]);

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
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setImportBtnClicked(false)}
              >
                {getEmptyTextMessage(attemptedMode)}
              </Alert>
            )}

            <ImportQuestionModalInputField
              importQuestions={importQuestions}
              surveyID={surveyID!}
              isLoading={isLoading || !!importJobID}
              importText={importText}
              setImportText={setImportText}
              setImportBtnClicked={setImportBtnClicked}
              setAttemptedMode={setAttemptedMode}
              handleClose={handleClose}
              existingQuestionsCount={existingQuestionsCount}
              setImportJobID={setImportJobID}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportQuestionsModal;
