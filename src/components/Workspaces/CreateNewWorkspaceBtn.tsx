import { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import NewSurveyModal from "../Modals/NewSurveyModal";
// import { NewSurveyProps } from "../../utils/types";

const CreateNewWorkspaceBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Button
          sx={{
            backgroundColor: "#494454",
            mr: 2,
            fontWeight: 600,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#494454",
            },
          }}
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          <AddIcon />
          Create New Workspace
        </Button>
        {/* <NewSurveyModal
          open={open}
          setOpen={setOpen}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
        /> */}
      </Box>
    </>
  );
};
export default CreateNewWorkspaceBtn;
