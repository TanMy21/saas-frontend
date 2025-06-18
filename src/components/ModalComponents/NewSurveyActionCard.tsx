import { Avatar, Box, ButtonBase, Typography } from "@mui/material";

import { useAppTheme } from "../../theme/useAppTheme";
import { NewSurveyActionCardProps } from "../../utils/types";

const NewSurveyActionCard = ({
  onClickHandler,
  icon,
  actionTitle,
  actionSubTitle,
}: NewSurveyActionCardProps) => {
  const { borders, brand, primary, textStyles } = useAppTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        width: "98%",
        height: "64px",
        border: borders.strong,
        borderRadius: 3,
      }}
    >
      <ButtonBase
        onClick={onClickHandler}
        sx={{
          width: "100%",
          height: "100%",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: 3,
            backgroundColor: "inherit",
            borderRadius: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "16%",
            height: "100%",
          }}
        >
          <Avatar
            sx={{
              bgcolor: brand.avatarBg3,
              color: primary.dark,
              width: 48,
              height: 48,
              borderRadius: "50%",
            }}
            variant="rounded"
          >
            {icon}
          </Avatar>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.5,
            padding: 1,
            width: "80%",
            height: "98%",
          }}
        >
          <Typography sx={textStyles.strongH6}>{actionTitle}</Typography>
          <Typography sx={textStyles.newActionCardSubtitle}>
            {actionSubTitle}
          </Typography>
        </Box>
      </ButtonBase>
    </Box>
  );
};

export default NewSurveyActionCard;
