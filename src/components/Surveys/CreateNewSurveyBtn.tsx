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
      <Box>
        <Button
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#6152EF",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "10px",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#6152EF",
            },
          }}
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          <AddIcon />
          Create new survey
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
