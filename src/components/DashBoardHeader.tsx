import { Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";

const DashBoardHeader = () => {
  return (
    <AppBar
      position="static"
      sx={{ m: "0px", bgcolor: "white", borderBottom: 2, height: "64px" }}
    >
      <Toolbar variant="dense">
        <div>Header</div>
      </Toolbar>
    </AppBar>
  );
};

export default DashBoardHeader;
