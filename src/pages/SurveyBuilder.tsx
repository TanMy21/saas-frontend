import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useGetSurveyCanvasByIdQuery } from "../app/slices/surveysApiSlice";
import { fetchUser, selectUser } from "../app/slices/userSlice";
import { AppDispatch } from "../app/store";
import BuilderSpace from "../components/BuilderSpace";
import CreateNewSurveyModal from "../components/Modals/CreateNewSurveyModal";
import ImportQuestionsModal from "../components/Modals/ImportQuestionsModal";
import ScrollbarStyle from "../components/ScrollbarStyle";
import SurveyBuilderHeader from "../components/Surveys/SurveyBuilderHeader";
import SurveyBuilderLeftSidebar from "../components/Surveys/SurveyBuilderLeftSidebar";
import { Element, LocationStateProps } from "../utils/types";

const SurveyBuilder = () => {
  const { surveyID } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const { workspaceId, workspaceName } =
    (location.state as LocationStateProps) || {};

  const isOpen = location.state?.openModal || false;
  const isOpenImport = location.state?.openModalImport || false;
  // const [stepIndex, setStepIndex] = useState(0);
  const [runTour, setRunTour] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("desktop");
  const [loading, setLoading] = useState(false);
  const [noElements, setNoElements] = useState(false);

  const {
    data: surveyCanvas,
    isError: isErrorCanvas,
    error: errorCanvas,
    isLoading: isLoadingCanvas,
    isFetching: isFetchingCanvas,
  } = useGetSurveyCanvasByIdQuery(surveyID, {
    skip: !surveyID,
    pollingInterval: 200000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { questions: Elements, title } = surveyCanvas || {};

  useEffect(() => {
    if (isErrorCanvas) {
      navigate("/login");
    }
  }, [isErrorCanvas, errorCanvas, navigate]);

  useEffect(() => {
    if (!isLoadingCanvas && !isFetchingCanvas) {
      setLoading(false);
      setNoElements(!Elements || Elements.length === 0);

      if (Elements && Elements.length > 0 && !questionId) {
        const sortedQuestions = [...Elements].sort(
          (a: Element, b: Element) => a.order! - b.order!
        );

        if (
          !questionId ||
          !sortedQuestions.find((q) => q.questionID === questionId)
        ) {
          setQuestionId(sortedQuestions[0].questionID);
        }
      }
    } else {
      setLoading(true);
    }
  }, [isLoadingCanvas, isFetchingCanvas, Elements, questionId]);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    setRunTour(true);
  }, []);

  if (!user) {
    return null;
  }

  const { tours } = user;
  const { hasCompletedBuilderTour, hasSkippedBuilderTour } = tours;

  let isTourEnabled = false;

  if (import.meta.env.VITE_ENABLE_BUILDER_TOUR === "true") {
    isTourEnabled = !hasCompletedBuilderTour && !hasSkippedBuilderTour;
  }

   


  return (
    <>
      <ScrollbarStyle />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowX: "hidden",
          overflowY: "scroll",
          width: "100%",
          height: "100%",
          // border: "2px solid black",
          "&::-webkit-scrollbar": {
            width: "10px", // Scrollbar width
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1", // Scrollbar track color
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#61A5D2", // Scrollbar thumb color
            borderRadius: "10px", // Rounded corners on the scrollbar thumb
            "&:hover": {
              background: "#555", // Scrollbar thumb hover color
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "6vh",
            // border: "2px solid red",
          }}
        >
          <SurveyBuilderHeader
            survey={surveyCanvas}
            workspaceId={workspaceId!}
            workspaceName={workspaceName!}
            title={title}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "94vh",
            backgroundColor: "#F8F9FE",
            // border: "4px solid green",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "16%",
              height: "100%",
              // border: "2px solid red",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                bgcolor: "#FFFFFF",
                // border: "2px solid blue",
                borderRight: "2px solid #E5E7EB",
                zIndex: 10,
              }}
            >
              <SurveyBuilderLeftSidebar
                surveyID={surveyID}
                setQuestionId={setQuestionId}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "84%",
              height: "100%",
              // border: "2px solid blue",
            }}
          >
            <BuilderSpace
              questionId={questionId}
              Elements={Elements}
              display={display}
              setDisplay={setDisplay}
              noElements={noElements}
            />
          </Box>
        </Box>
        <CreateNewSurveyModal
          isOpen={isOpen}
          surveyID={surveyID}
          setSurveyTitle={setSurveyTitle}
        />
        <ImportQuestionsModal isOpen={isOpenImport} surveyID={surveyID} />
      </Box>
    </>
  );
};

export default SurveyBuilder;
