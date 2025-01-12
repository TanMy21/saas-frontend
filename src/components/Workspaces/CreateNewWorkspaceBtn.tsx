import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";

import { WorkspacesProp } from "../../utils/types";

const CreateNewWorkspaceBtn = ({ handleOpen }: WorkspacesProp) => {
  return (
    <>
      <Box sx={{ mt: 1 }}>
        <Button
          sx={{
            backgroundColor: "##6152EF",
            mr: 2,
            fontWeight: 600,
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "##6152EF",
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
