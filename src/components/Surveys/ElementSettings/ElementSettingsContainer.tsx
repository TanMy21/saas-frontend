import { Suspense } from "react";

import { Box, CircularProgress } from "@mui/material";

import PermissionContext from "../../../context/PermissionContext";
import useAuth from "../../../hooks/useAuth";
import { elementSettingsComponents } from "../../../utils/elementComponentRegistry";
import {
  ElementSettingsContainerProps,
  QuestionTypeKey,
} from "../../../utils/types";

const ElementSettingsContainer = ({
  questionId,
  question,
}: ElementSettingsContainerProps) => {
  const { can } = useAuth();

  const canEditQuestion = can("UPDATE_QUESTION");

  const ElementSettingsComponent =
    // firstQuestion
    elementSettingsComponents[question?.type as QuestionTypeKey];

  return (
    <>
      <PermissionContext.Provider value={{ canEditQuestion }}>
        <Box component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { md: "80%", xl: "100%" },
            height: "100%",
            left: "0%",
            m: 0,
            p: 0,
            boxSizing: "border-box",
            // border: "2px solid blue",
          }}
        >
          {question?.type && questionId && ElementSettingsComponent && (
            <Suspense
              fallback={
                <Box component="div"
                  sx={{
                    minHeight: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              }
            >
              <ElementSettingsComponent
                qID={questionId}
                question={question}
                canEdit={canEditQuestion}
              />
            </Suspense>
          )}
        </Box>
      </PermissionContext.Provider>
    </>
  );
};

export default ElementSettingsContainer;
