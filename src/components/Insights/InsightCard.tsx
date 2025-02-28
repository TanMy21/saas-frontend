import { Box } from "@mui/material";

import { InsightCardProps } from "../../utils/types";

const InsightCard = ({
  title,
  value,
  description,
  icon: Icon,
  type,
  iconColor,
}: InsightCardProps) => {
  const formatValue = () => {
    if (type === "NUMBER" && typeof value === "number") {
      return value;
    }
    if (type === "PERCENTAGE" && typeof value === "number") {
      return `${value}%`;
    }
    if (type === "TIME" && typeof value === "string") {
      return value;
    }
    return "0";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "1%",
        width: "30%",
        height: "80%",
        gap: "2%",
        backgroundColor: "white",
        border: "2px solid #E3EAF5",
        borderRadius: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "96%",
          height: "68%",
          gap: "1%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "72%",
            height: "96%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              margin: "auto",
              padding: "1%",
              width: "96%",
              height: "24%",
              color: "#5F6876",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: "4%",
              width: "96%",
              height: "48%",
              color: "black",
              fontWeight: "bold",
              fontSize: "40px",
            }}
          >
            {formatValue()}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "24%",
            height: "96%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "4%",
              color: iconColor,
              width: "80%",
              height: "52%",
              border: "2px solid #EFF1F4",
              borderRadius: "16px",
            }}
          >
            <Icon size={32} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          width: "96%",
          height: "28%",
          color: "#6A717F",
        }}
      >
        {description}
      </Box>
    </Box>
  );
};

export default InsightCard;
