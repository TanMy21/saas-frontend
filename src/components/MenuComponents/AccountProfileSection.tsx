import { Avatar, Box, MenuItem, Typography } from "@mui/material";

export const AccountProfileSection = ({ firstname, email, brand }: any) => {
  return (
    <MenuItem
      sx={{
        mx:1,
        borderRadius: "8px",

        "&:hover": {
          borderRadius: "12px",
        },
        "&.Mui-selected": {
          borderRadius: "12px",
        },
        "&.Mui-selected:hover": {
          borderRadius: "12px",
        },
      }}
    >
      <Box display={"flex"}>
        <Box mt={1}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: brand.avatarBg1,
              color: brand.avatarTxt1,
            }}
          >
            {email?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <Box ml={2}>
          <Typography
            sx={{ color: "black", fontWeight: "bold", fontSize: "16px" }}
          >
            {firstname}
          </Typography>
          <Box sx={{ fontSize: "12px" }}>{email}</Box>
        </Box>
      </Box>
    </MenuItem>
  );
};
