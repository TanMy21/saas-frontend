import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { elementIcons } from "../../../utils/elementsConfig";
import { AddElementMenuProps, ErrorData } from "../../../utils/types";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {
  useCreateElementMutation,
  useGetElementsForSurveyQuery,
} from "../../../app/slices/elementApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
const AddElementMenu = ({
  surveyID,
  anchorEl,
  open,
  handleClose,
  handleClick,
}: AddElementMenuProps) => {
  const [createElement, { isError, error }] = useCreateElementMutation();

  const { data: elements } = useGetElementsForSurveyQuery(surveyID);

  const handleElementAdd = async (type: string) => {
    const order = elements ? elements.length + 1 : 1;
    try {
      await createElement({ surveyID, type, order });
    } catch (error) {
      console.error(error);
    }
  };

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
  }, [isError, error]);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          background: "#47658F",
          width: "32px",
          height: "32px",
          borderRadius: 1,
          color: "white",
          "&:hover": {
            backgroundColor: "#47658F",
          },
        }}
      >
        <AddOutlinedIcon fontSize="medium" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        sx={{
          width: 200,
          mt: "4%",
          ml: "2%",
        }}
      >
        <MenuItem onClick={() => handleElementAdd("BINARY")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#31029c" }} mt={1}>
              {elementIcons.BINARY}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Binary
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("RADIO")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#f7c435" }} mt={1}>
              {elementIcons.RADIO}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Choice
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("TEXT")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#c45161" }} mt={1}>
              {elementIcons.TEXT}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Text
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("NUMBER")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#d69e49" }} mt={1}>
              {elementIcons.NUMBER}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Number
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("RANK")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#ffa600" }} mt={1}>
              {elementIcons.RANK}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Rank
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("RANGE")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#036b82" }} mt={1}>
              {elementIcons.RANGE}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Scale
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("MEDIA")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#f2b6c0" }} mt={1}>
              {elementIcons.MEDIA}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Media
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleElementAdd("MULTIPLE_CHOICE")}>
          <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
            <Typography sx={{ fontSize: "24px", color: "#369acc" }} mt={1}>
              {elementIcons.MULTIPLE_CHOICE}
            </Typography>
            <Typography sx={{ fontSize: "16px" }} ml={2}>
              Checkbox
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AddElementMenu;
