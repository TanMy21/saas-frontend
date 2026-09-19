import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";

type AddMediaOptionCardProps = {
  disabled: boolean;
  onClick: () => void;
};

const AddMediaOptionCard = ({ disabled, onClick }: AddMediaOptionCardProps) => {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        border: "2px dashed #d0d5ff",
        borderRadius: "16px",
        backgroundColor: "rgba(91, 106, 208, 0.02)",
        color: "#5b6ad0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontSize: 16,
        fontWeight: 600,
        flex: 1,
        minHeight: { xs: 160, sm: 200, md: 240, xl: 240 },
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(91, 106, 208, 0.05)",
          borderColor: "#5b6ad0",
          transform: "translateY(-2px)",
        },
      }}
    >
      <AddIcon sx={{ fontSize: 24 }} />
      <span>Add Option</span>
    </Box>
  );
};

export default AddMediaOptionCard;
