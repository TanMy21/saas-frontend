import { Typography } from "@mui/material";

import { errorsProp } from "../utils/types";

const FormErrors = ({ errors }: errorsProp) => {
  return (
    <span>
      <Typography variant="h6" sx={{ fontSize: 12, color: "red" }} gutterBottom>
        {errors}
      </Typography>
    </span>
  );
};

export default FormErrors;
