import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useState } from "react";
import { ElementType, SurveyBuilderLeftSidebarProps } from "../../utils/types";
import { elementIcons, elementTypes } from "../../utils/elementsConfig";

const SurveyBuilderLeftSidebar = ({
  setElementDetail,
  setQIndex,
  setElements,
  elements,
}: SurveyBuilderLeftSidebarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleElementAdd = (menuOption: string) => {
    setElements((prevElements) => [...prevElements, elementTypes[menuOption]]);
  };

  const handleElementClick = (element: ElementType, index: number) => {
    setElementDetail(element);
    setQIndex((index + 1).toString());
  };

  return (
    <Box
      p={2}
      sx={{
        background: "white",
        height: "100vh",
        position: "fixed",
        top: "5vh",
      }}
    >
      <Grid container display={"flex"} flexDirection={"column"}>
        <Grid
          item
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"end"}
          mb={4}
          sx={{
            width: "280px",
            height: "40px",
          }}
        >
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

          {/* Menu */}
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
              mt: "2%",
              ml: "2%",
            }}
          >
            <MenuItem onClick={() => handleElementAdd("Binary")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#31029c" }} mt={1}>
                  {elementIcons.Binary}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Binary
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Choice")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#f7c435" }} mt={1}>
                  {elementIcons.Choice}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Choice
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Text")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#c45161" }} mt={1}>
                  {elementIcons.Text}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Text
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Number")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#d69e49" }} mt={1}>
                  {elementIcons.Number}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Number
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Rank")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#ffa600" }} mt={1}>
                  {elementIcons.Rank}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Rank
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Scale")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#036b82" }} mt={1}>
                  {elementIcons.Scale}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Scale
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Media")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#f2b6c0" }} mt={1}>
                  {elementIcons.Media}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Media
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleElementAdd("Checkbox")}>
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Typography sx={{ fontSize: "24px", color: "#369acc" }} mt={1}>
                  {elementIcons.Checkbox}
                </Typography>
                <Typography sx={{ fontSize: "16px" }} ml={2}>
                  Checkbox
                </Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Grid>
        {elements.map(
          (
            element,
            index // Replace with actual data
          ) => (
            <Grid
              item
              display={"flex"}
              flexDirection={"row"}
              alignContent={"center"}
              mb={2}
              sx={{
                width: "280px",
                height: "44px",
                border: "2px dotted blue",
                borderRadius: "8px",
              }}
            >
              <Button
                key={index}
                onClick={() => handleElementClick(element, index)}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  flexDirection={"row"}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    ml={2}
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    {element.icon}
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <Typography color={"black"} fontWeight={"bold"}>
                      {index + 1}
                    </Typography>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      width: "196px",
                      height: "40px",
                    }}
                  >
                    <Typography
                      ml={1}
                      sx={{
                        color: "black",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        textOverflow: "clip",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {element.question}
                    </Typography>
                  </Box>
                </Box>
              </Button>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  );
};
export default SurveyBuilderLeftSidebar;
