import { useState } from "react";

import { Box, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { useAppTheme } from "../../../theme/useAppTheme";
import { ElementProps } from "../../../utils/types";

const ElementQuestionText = ({ display }: ElementProps) => {
  const { primary } = useAppTheme();
  const dispatch = useDispatch();
  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, order, text, description, type } = question || {};

  const [isEditing, setIsEditing] = useState(false);

  const titleFontSize =
    typographySettings.titleFontSize ??
    question?.questionPreferences?.titleFontSize ??
    36;
  const titleFontSizeMobile =
    typographySettings.titleFontSizeMobile ??
    question?.questionPreferences?.titleFontSizeMobile ??
    28;
  const titleFontColor =
    typographySettings.titleFontColor ??
    question?.questionPreferences?.titleFontColor ??
    "#000000";
  const descriptionFontSize =
    typographySettings.descriptionFontSize ??
    question?.questionPreferences?.descriptionFontSize ??
    16;
  const descriptionFontSizeMobile =
    typographySettings.descriptionFontSizeMobile ??
    question?.questionPreferences?.descriptionFontSizeMobile ??
    16;
  const descriptionFontColor =
    typographySettings.descriptionFontColor ??
    question?.questionPreferences?.descriptionFontColor ??
    "#000000";

  const defaultFontSize = 20;
  const orderFontSize = titleFontSize * 0.6;
  const actualFontSize =
    display === "mobile" ? defaultFontSize : orderFontSize || defaultFontSize;
  const circleSize = actualFontSize * 1.2;

  const nonOrderableTypes = [
    "WELCOME_SCREEN",
    "INSTRUCTIONS",
    "EMAIL_CONTACT",
    "END_SCREEN",
  ];

  const isNonOrderableType = nonOrderableTypes.includes(type!);

  const [updateElementText] = useUpdateElementTextMutation();
  const [updateElementDescription] = useUpdateElementDescriptionMutation();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateQuestionField({ key: "text", value: event.target.value }));
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateQuestionField({ key: "description", value: event.target.value })
    );
  };

  const handleBlur = () => {
    updateElementText({ questionID, text });
    setIsEditing(false);
  };

  const handleBlurDescription = () => {
    updateElementDescription({ questionID, description });
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        transformOrigin: "bottom",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // border: "2px dashed orange",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          // marginTop: "12%",
          width: display === "mobile" ? "92%" : "98%",
          // border: "2px solid green",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            width: "100%",
            // border: "2px solid green",
          }}
        >
          {isNonOrderableType ? null : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: "50%",
                backgroundColor: primary.light,
                marginRight: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  // fontSize: display === "mobile" ? "32px" : orderFontSize || 20,
                  fontSize: orderFontSize || 20,
                }}
              >
                {order}
              </Typography>
            </Box>
          )}
          <Box
            onDoubleClick={handleDoubleClick}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // border: "2px solid orange",
            }}
          >
            {isEditing ? (
              <TextField
                id="outlined-basic"
                type="text"
                value={text}
                onChange={handleChangeText}
                onBlur={handleBlur}
                sx={{
                  backgroundColor: "transparent",
                  fontStyle: "italic",
                  fontSize: "3.75rem",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    fontSize: "2rem",
                  },
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  whiteSpace: "normal",
                  width: "100%",
                  maxWidth: "80ch",
                  fontStyle: "normal",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  fontSize:
                    display === "mobile" ? titleFontSizeMobile : titleFontSize,
                  textAlign: "start",
                  color: titleFontColor,
                  lineHeight: 1.4,
                  overflowWrap: "break-word",
                  hyphens: "auto",
                  letterSpacing: "0.01em",
                  wordSpacing: "0.05em",
                }}
              >
                {text}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: display === "mobile" ? "8% auto" : "1% auto",
            // border: "2px solid black",
          }}
        >
          <Box onDoubleClick={handleDoubleClick}>
            {isEditing ? (
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                value={description}
                onChange={handleChangeDescription}
                onBlur={handleBlurDescription}
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiInputBase-input": {
                    fontSize: "1.6rem",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                }}
              />
            ) : (
              <Typography
                sx={{
                  fontStyle: "italic",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  whiteSpace: "normal",
                  width: "fit-content",
                  fontSize:
                    display === "mobile"
                      ? descriptionFontSizeMobile
                      : descriptionFontSize,
                  color: descriptionFontColor,
                }}
              >
                {description === "" ? "Description (optional)" : description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ElementQuestionText;
