import { Typography } from "@mui/material";

interface errorsProp {
  errors?: string;
}

const FormErrors = ({ errors }: errorsProp) => {
  return (
    <span>
      <Typography variant="h6" sx={{ fontSize: 12, color:"red", marginTop:"8px" }} gutterBottom>
        {errors}
      </Typography>
    </span>
  );
};

export default FormErrors;
