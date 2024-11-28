import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import IconButton from "@mui/material/IconButton";

import { WorkspacesProp } from "../../utils/types";

const NewWorkspaceIconButton = ({ handleOpen }: WorkspacesProp) => {
  return (
    <IconButton
      onClick={handleOpen}
      sx={{
        background: "#4F46E5",
        maxWidth: "32px",
        maxHeight: "32px",
        marginRight: "2%",
        marginTop: "8%",
        borderRadius: 1,
        color: "white",
        "&:hover": {
          backgroundColor: "#4F46E5",
        },
      }}
    >
      <AddOutlinedIcon fontSize="medium" />
    </IconButton>
  );
};

export default NewWorkspaceIconButton;
