import {
  Box,
  InputAdornment,
  Slider,
  TextField,
  useMediaQuery,
} from "@mui/material";
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
  const isMd = useMediaQuery("(min-width:900px) and (max-width:1280px)");
  const isXl = useMediaQuery("(min-width:1300px) and (max-width:1900px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { md: "column", xl: "row" },
        justifyContent: "space-between",
        width: "100%",
        height: { md: "80px", xl: "40px" },
        // border: "2px solid green",
        p: { md: "2px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: { md: "90%", xl: "50%" },
          // height: { md: "120px" },
          ml: 1,
          marginTop: { md: "20%", xl: "0%" },
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Slider
              min={8}
              max={72}
              step={1}
              valueLabelDisplay={"on"}
              // valueLabelDisplay={"on"}
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
              sx={{
                flex: 1,
                "& .MuiSlider-markLabel": {
                  fontSize: "12px",
                  color: "black",
                },
                "& .MuiSlider-mark": {
                  backgroundColor: "black",
                  height: 8,
                  width: 2,
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#6846E5",
                  color: "#fff",
                  fontSize: {xl:"10px"},
                  fontWeight: "bold",
                  borderRadius: "4px",
                  // top: -10,
                  "& *": {
                    background: "transparent",
                    color: "inherit",
                  },
                },
              }}
            />
          )}
        />
      </Box>
      {isXl && (
        <Box
          sx={{
            display: { md: "none", xl: "flex" },
            justifyContent: { md: "center" },
            alignItems: "center",
            width: { xl: "40%" },
            height: { md: "none", xl: "40px" },
            // margin: { md: "0 auto" },
            // border: "2px solid red",
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
      )}
    </Box>
  );
};

export default FontSizeControl;
