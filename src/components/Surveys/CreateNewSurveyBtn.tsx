import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";

import { NewSurveyProps } from "../../utils/types";
import NewSurveyModal from "../Modals/NewSurveyModal";

const CreateNewSurveyBtn = ({ workspaceId, workspaceName }: NewSurveyProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Button
          sx={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#6152EF",
            mr: 2,
            fontWeight: 600,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#6152EF",
            },
          }}
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          <Box mt={0.5} mr={1}>
            <AddIcon />
          </Box>
          <Box sx={{ fontWeight: 700 }}>Create New Survey</Box>
        </Button>
        <NewSurveyModal
          open={open}
          setOpen={setOpen}
          workspaceId={workspaceId!}
          workspaceName={workspaceName!}
        />
      </Box>
    </>
  );
};
export default CreateNewSurveyBtn;
