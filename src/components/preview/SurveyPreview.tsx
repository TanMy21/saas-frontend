import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import { useGetSurveyPreviewByIdQuery } from "../../app/slices/surveysApiSlice";

import { normalizePreviewResponse } from "./previewData";
import PreviewHeader, { type PreviewViewport } from "./PreviewHeader";
import PreviewNavigation from "./PreviewNavigation";
import PreviewQuestionRenderer from "./PreviewQuestionRenderer";
import PreviewShell from "./PreviewShell";

const SurveyPreview = () => {
  const { surveyID } = useParams();
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetSurveyPreviewByIdQuery(surveyID, {
      skip: !surveyID,
      refetchOnFocus: true,
    });

  console.log(data);

  const preview = useMemo(() => normalizePreviewResponse(data), [data]);
  const questions = preview?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [surveyID]);

  useEffect(() => {
    setCurrentIndex((index) =>
      Math.min(index, Math.max(questions.length - 1, 0)),
    );
  }, [questions.length]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = preview?.title
      ? `${preview.title} – Preview`
      : "Survey preview";

    return () => {
      document.title = previousTitle;
    };
  }, [preview?.title]);

  const renderPreviewContent = () => {
    if (isLoading || (isFetching && !preview)) {
      return (
        <Box
          component="div"
          sx={{
            display: "grid",
            flex: 1,
            minHeight: 320,
            placeItems: "center",
          }}
        >
          <Box component="div" sx={{ textAlign: "center" }}>
            <CircularProgress size={30} />
            <Typography sx={{ mt: 1.5, color: "#667085", fontSize: 14 }}>
              Loading preview…
            </Typography>
          </Box>
        </Box>
      );
    }

    if (isError) {
      return (
        <Box
          component="div"
          sx={{
            display: "grid",
            flex: 1,
            minHeight: 320,
            placeItems: "center",
            p: 3,
          }}
        >
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            The survey preview could not be loaded.
          </Alert>
        </Box>
      );
    }

    if (!currentQuestion) {
      return (
        <Box
          component="div"
          sx={{
            display: "grid",
            flex: 1,
            minHeight: 320,
            placeItems: "center",
            p: 3,
          }}
        >
          <Box component="div" sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "#101828", fontWeight: 700 }}>
              Nothing to preview yet
            </Typography>
            <Typography sx={{ mt: 0.75, color: "#667085", fontSize: 14 }}>
              Add a question to this survey and try again.
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <>
        <PreviewQuestionRenderer
          question={currentQuestion}
          viewport={viewport}
        />
        <PreviewNavigation
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          viewport={viewport}
          onPrevious={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
          onNext={() =>
            setCurrentIndex((index) =>
              Math.min(index + 1, questions.length - 1),
            )
          }
        />
      </>
    );
  };

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100dvh",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <PreviewHeader
        viewport={viewport}
        surveyTitle={preview?.title}
        onViewportChange={setViewport}
      />
      <PreviewShell viewport={viewport}>{renderPreviewContent()}</PreviewShell>
    </Box>
  );
};

export default SurveyPreview;
