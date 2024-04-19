import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import { SurveyBuilderLeftSidebarProps } from "../../utils/types";
import AddElementMenu from "./Elements/AddElementMenu";
import ElementsPanel from "./Elements/ElementsPanel";

const SurveyBuilderLeftSidebar = ({
  surveyID,
  setQuestionId,
}: // setElementDetail,
// setQIndex,
// setElements,
// elements,
SurveyBuilderLeftSidebarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container display={"flex"} flexDirection={"column"}>
      <Grid
        item
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"end"}
        mt={2}
        mb={2}
        sx={{
          width: "98%",
          height: "40px",
        }}
      >
        {/* Menu */}
        <AddElementMenu
          surveyID={surveyID!}
          anchorEl={anchorEl}
          open={open}
          handleClick={handleClick}
          handleClose={handleClose}
          // handleElementAdd={handleElementAdd}
        />
      </Grid>
      <ElementsPanel
        surveyID={surveyID!}
        setQuestionId={setQuestionId}
        // handleElementClick={handleElementClick}
        // setElements={setElements}
      />

      <Divider sx={{ marginTop: "16px" }} />
    </Grid>
  );
};

export default SurveyBuilderLeftSidebar;
