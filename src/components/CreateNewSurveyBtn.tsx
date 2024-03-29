import { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NewSurveyModal from "./Modals/NewSurveyModal";

const CreateNewSurveyBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Button
          sx={{
            backgroundColor: "#44546A",
            mr: 2,
            textTransform: "capitalize",
          }}
          variant="contained"
          size="small"
          onClick={handleOpen}
        >
          <AddIcon />
          Create New Survey
        </Button>
        <NewSurveyModal open={open} setOpen={setOpen} />
      </Box>
    </>
  );
};
export default CreateNewSurveyBtn;
