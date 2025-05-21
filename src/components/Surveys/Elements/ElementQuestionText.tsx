import { useState } from "react";

import { Box, TextField, Typography } from "@mui/material";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";

import {
  useUpdateElementDescriptionMutation,
  useUpdateElementTextMutation,
} from "../../../app/slices/elementApiSlice";
import { updateQuestionField } from "../../../app/slices/elementSlice";
import { RootState } from "../../../app/store";
import { ElementProps } from "../../../utils/types";

const ElementQuestionText = ({ display }: ElementProps) => {
  const dispatch = useDispatch();
  const typographySettings = useSelector(
    (state: RootState) => state.elementTypography
  );

  const question = useSelector(
    (state: RootState) => state.question.selectedQuestion
  );
  const { questionID, order, text, description, type } = question || {};

  const [isEditing, setIsEditing] = useState(false);

  const qFontSize = display === "mobile" ? "28px" : "32px";
  const descritptionFontSize = display === "mobile" ? "16px" : "20px";
  const qWhiteSpace = display === "mobile" ? "0.1em" : "normal";

  const titleFontSize =
    typographySettings.titleFontSize ??
    question?.questionPreferences?.titleFontSize ??
    36;
  const titleFontColor =
    typographySettings.titleFontColor ??
    question?.questionPreferences?.titleFontColor ??
    "#000000";
  const descriptionFontSize =
    typographySettings.descriptionFontSize ??
    question?.questionPreferences?.descriptionFontSize ??
    16;
  const descriptionFontColor =
    typographySettings.descriptionFontColor ??
    question?.questionPreferences?.descriptionFontColor ??
    "#000000";

  const orderFontSize = titleFontSize * 0.5;
  const arrowFontSize = titleFontSize * 0.45;

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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          margin: "auto",
          // marginTop: "12%",
          width: "98%",
          // border: "2px solid red",
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
                width: "fit-content",
                marginRight: 1,
              }}
            >
              <Typography
                sx={{
                  marginTop: 1,
                  fontWeight: "bold",
                  color: "black",
                  fontSize: orderFontSize || 20,
                }}
              >
                {order}
              </Typography>
            </Box>
          )}
          {isNonOrderableType ? null : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                // border: "2px solid green",
              }}
            >
              <Typography
                sx={{
                  marginTop: 2,
                  marginRight: 2,
                  fontSize: arrowFontSize || 16,
                }}
              >
                <FaArrowRightLong />
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
                  whiteSpace: qWhiteSpace,
                  width: "100%",
                  maxWidth: "80ch",
                  fontStyle: "italic",
                  fontFamily:
                    "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  fontSize: titleFontSize,
                  textAlign: {
                    xs: "start",
                    sm: "start",
                    md: "start",
                    xl: "justify",
                  },
                  color: titleFontColor,
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
            margin: "auto",
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
                  whiteSpace: qWhiteSpace,
                  width: "fit-content",
                  fontSize: descriptionFontSize,
                  color: descriptionFontColor,
                }}
              >
                {description === "" ? "Description (optional)" : description}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ElementQuestionText;
