import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { WorkspacesProp } from "../../utils/types";

const CreateNewWorkspaceBtn = ({ handleOpen }: WorkspacesProp) => {
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
      </Box>
    </>
  );
};
export default CreateNewWorkspaceBtn;
