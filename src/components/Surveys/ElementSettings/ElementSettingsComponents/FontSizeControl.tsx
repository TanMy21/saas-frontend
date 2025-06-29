import { Box, InputAdornment, Slider, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDispatch } from "react-redux";

import { updateTypographyField } from "../../../../app/slices/elementTypographySlice";
import { FontSizeControlProps } from "../../../../utils/types";

const FontSizeControl = ({
  name,
  dispatchKey,
  control,
  markFormTouched,
}: FontSizeControlProps) => {
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "50%",
          ml: 1,
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Slider
              min={8}
              max={72}
              value={field.value}
              onChange={(_, val) => {
                const numericValue = Array.isArray(val) ? val[0] : val;
                field.onChange(numericValue);
                markFormTouched();
                dispatch(
                  updateTypographyField({
                    key: dispatchKey,
                    value: numericValue,
                  })
                );
              }}
              sx={{ flex: 1 }}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "40%",
          height: "40px",
          // border:"2px solid red",
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              variant="standard"
              value={field.value}
              onChange={(e) => {
                const value = Number(e.target.value);
                field.onChange(value);
                markFormTouched();
                dispatch(
                  updateTypographyField({
                    key: dispatchKey,
                    value: value,
                  })
                );
              }}
              inputProps={{ min: 8, max: 72 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ color: "#6846E5", marginBottom: 0.5 }}
                  >
                    px
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{
                width: "100%",
                // border:"2px solid green",
                "& .MuiInputBase-root": {
                  borderRadius: 1,
                  backgroundColor: "#EEF2FF",
                  height: "36px",
                  minWidth: 80,
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#6846E5",
                  // border: "2px solid blue",
                  boxShadow: "none",
                  px: 1.25,
                },
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default FontSizeControl;
