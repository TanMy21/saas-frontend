import { useEffect } from "react";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import {
  useCreateElementMutation,
  useCreateScreenElementMutation,
} from "../../../app/slices/elementApiSlice";
import { addElement } from "../../../app/slices/surveySlice";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/typedReduxHooks";
import { useAppTheme } from "../../../theme/useAppTheme";
import { elementIcons } from "../../../utils/elementsConfig";
import { AddElementMenuProps, Element, ErrorData } from "../../../utils/types";

const AddElementMenu = ({
  surveyID,
  anchorEl,
  open,
  handleClose,
  handleClick,
}: AddElementMenuProps) => {
  const { primary } = useAppTheme();
  const dispatch = useAppDispatch();
  const [createElement, { isError, error }] = useCreateElementMutation();

  const [createScreenElement, { isError: isErrorScreen, error: errorScreen }] =
    useCreateScreenElementMutation();

  const elements = useAppSelector(
    (state: RootState) => state.surveyBuilder.elements
  );

  const calculateOrder = (elements: Element[], type: string) => {
    const elementTypes = [
      "WELCOME_SCREEN",
      "END_SCREEN",
      "INSTRUCTIONS",
      "EMAIL_CONTACT",
    ];
    const elementTypeExists = elementTypes.includes(type);

    const nonOrderableTypes = [
      "WELCOME_SCREEN",
      "END_SCREEN",
      "INSTRUCTIONS",
      "EMAIL_CONTACT",
    ];

    if (elementTypeExists) {
      return null;
    }

    const orderableQuestionsCount = elements.filter(
      (element: Element) => !nonOrderableTypes.includes(element.type)
    ).length;
    return orderableQuestionsCount + 1;
  };

  const handleElementAdd = async (type: string) => {
    const order: number | null = calculateOrder(elements ?? [], type);
    try {
      const newElement = await createElement({
        surveyID,
        type,
        order,
      }).unwrap();
      dispatch(addElement(newElement));
    } catch (error) {
      console.error(error);
    }
  };

  const handleScreenElementAdd = async (type: string) => {
    try {
      const newScreenElement = await createScreenElement({
        surveyID,
        type,
      }).unwrap();
      dispatch(addElement(newScreenElement));
    } catch (error) {
      console.error(error);
    }
  };

  const containsWelcome = elements?.some(
    (element) => element.type === "WELCOME_SCREEN"
  );

  const containsInstruction = elements?.some(
    (element) => element.type === "INSTRUCTIONS"
  );

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }

    if (isErrorScreen) {
      const errorData = errorScreen as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, isErrorScreen, error, errorScreen]);

  return (
    <>
      <IconButton
        aria-label="Add question or screen"
        onClick={handleClick}
        disableRipple
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary.dark,
          color: "#fff",
          "&:hover": { backgroundColor: primary.dark },
          "&:focus-visible": {
            outline: "2px solid rgba(76, 111, 255, 0.6)",
            outlineOffset: 2,
          },
        }}
      >
        <AddOutlinedIcon fontSize="medium" />
      </IconButton>
      <Menu
        id="add-element-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.25,
              ml: 1.5,
              width: 520,
              borderRadius: 2,
              border: "1px solid #EEF2F7",
              boxShadow:
                "0 8px 28px rgba(16,24,40,0.12), 0 2px 6px rgba(16,24,40,0.06)",
            },
          },
        }}
        MenuListProps={{
          dense: true,
          disablePadding: true,
          sx: {
            py: 1,
            "& .MuiMenuItem-root": {
              py: 1,
              minHeight: 40,
            },
            "& .MuiMenuItem-root + .MuiMenuItem-root": {
              mt: 0.25,
            },
          },
        }}
      >
        <Grid container spacing={0.75} sx={{ px: 1 }}>
          {/* Questions */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ px: 1, py: 0.75 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                Questions
              </Typography>
            </Box>
            <MenuItem onClick={() => handleElementAdd("THREE_D")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#086083ff", lineHeight: 1 }}
                >
                  {elementIcons.THREE_D}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  3D
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("BINARY")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#31029c", lineHeight: 1 }}
                >
                  {elementIcons.BINARY}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Binary
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("RADIO")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#f7c435", lineHeight: 1 }}
                >
                  {elementIcons.RADIO}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Choice
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("TEXT")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#c45161", lineHeight: 1 }}
                >
                  {elementIcons.TEXT}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Text
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("NUMBER")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#d69e49", lineHeight: 1 }}
                >
                  {elementIcons.NUMBER}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Number
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("RANK")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#ffa600", lineHeight: 1 }}
                >
                  {elementIcons.RANK}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Rank
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("RANGE")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#036b82", lineHeight: 1 }}
                >
                  {elementIcons.RANGE}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Scale
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("MEDIA")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#f2b6c0", lineHeight: 1 }}
                >
                  {elementIcons.MEDIA}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Media
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleElementAdd("MULTIPLE_CHOICE")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#369acc", lineHeight: 1 }}
                >
                  {elementIcons.MULTIPLE_CHOICE}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Checkbox
                </Typography>
              </Box>
            </MenuItem>
          </Grid>

          {/* Screens */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ px: 1, py: 0.75 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                Screens
              </Typography>
            </Box>

            <MenuItem onClick={() => handleScreenElementAdd("EMAIL_CONTACT")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#31029c", lineHeight: 1 }}
                >
                  {elementIcons.EMAIL_CONTACT}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Email
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem
              onClick={() => handleScreenElementAdd("INSTRUCTIONS")}
              disabled={containsInstruction}
              title={
                containsInstruction ? "Instructions screen already added" : ""
              }
            >
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#f7c435", lineHeight: 1 }}
                >
                  {elementIcons.INSTRUCTIONS}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Instructions
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem
              onClick={() => handleScreenElementAdd("WELCOME_SCREEN")}
              disabled={containsWelcome}
              title={containsWelcome ? "Welcome screen already added" : ""}
            >
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#c45161", lineHeight: 1 }}
                >
                  {elementIcons.WELCOME_SCREEN}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  Welcome Screen
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem onClick={() => handleScreenElementAdd("END_SCREEN")}>
              <Box display="flex" alignItems="center" gap={1.25}>
                <Typography
                  sx={{ fontSize: 24, color: "#d69e49", lineHeight: 1 }}
                >
                  {elementIcons.END_SCREEN}
                </Typography>
                <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                  End Screen
                </Typography>
              </Box>
            </MenuItem>
          </Grid>
        </Grid>
      </Menu>
    </>
  );
};

export default AddElementMenu;
