import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
const CreateNewSurveyBtn = () => {
  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Link
          to="/workspace"
          style={{ textDecoration: "none", color: "white" }}
        >
          <Button
            sx={{
              backgroundColor: "#44546A",
              mr: 2,
              textTransform: "capitalize",
            }}
            variant="contained"
            size="small"
          >
            <AddIcon />
            Create New Survey
          </Button>
        </Link>
      </Box>
    </>
  );
};
export default CreateNewSurveyBtn;
