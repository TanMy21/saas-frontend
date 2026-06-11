import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";

import { useGetOptionsOfQuestionQuery } from "../../../app/slices/optionApiSlice";
import { RootState } from "../../../app/store";
import { useAppSelector } from "../../../app/typedReduxHooks";
import useAuth from "../../../hooks/useAuth";
import { TIMED_CHOICE_IMAGE_ROLES } from "../../../utils/constants";
import { ElementProps, OptionType } from "../../../utils/types";

import { TimedChoiceOptionCard } from "./TimedChoiceOptionCard";

export const TimedChoiceResponse = ({ qID, display }: ElementProps) => {
  const { can } = useAuth();

  const canEdit = can("UPDATE_OPTION");

  const { data: options = [] as OptionType[] } = useGetOptionsOfQuestionQuery(
    qID!,
  );

  const question = useAppSelector(
    (state: RootState) => state.question.selectedQuestion,
  );

  const questionImages = question?.questionImages || [];
  const timedChoiceDisplayMode =
    question?.questionPreferences?.uiConfig?.timedChoiceDisplayMode ?? "TEXT";

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /**
   * Auto-resizes the option input as the creator types or pastes option labels.
   */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: display === "mobile" ? "92%" : "72%",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: display === "mobile" ? "column" : "row",
            gap: 2,
          }}
        >
          {options.map((option, index) => {
            /**
             * Option A gets the LEFT image role.
             * Option B gets the RIGHT image role.
             */
            const imageRole =
              index === 0
                ? TIMED_CHOICE_IMAGE_ROLES.LEFT
                : TIMED_CHOICE_IMAGE_ROLES.RIGHT;

            /**
             * Finds the image row already loaded on the selected question.
             */
            const optionImage = questionImages.find(
              (image) => image.role === imageRole,
            );

            return (
              <TimedChoiceOptionCard
                key={option.optionID}
                qID={qID!}
                option={option}
                index={index}
                canEdit={canEdit}
                displayMode={timedChoiceDisplayMode}
                imageRole={imageRole}
                optionImage={optionImage}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
