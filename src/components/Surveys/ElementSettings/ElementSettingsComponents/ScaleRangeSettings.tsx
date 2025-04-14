import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Select,
} from "@mui/material";

const ScaleRangeSettings = () => {
  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
      }}
      defaultExpanded={false}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            fontWeight: 500,
            // pl: "4%",
            color: "#453F46",
          }}
        >
          <LinearScaleIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          Slider Range
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8%",
          }}
        >
          <Box>
            {/* <Controller
            name="minValue"
            control={control}
            render={({ field }) => ( */}
            <Select
              // value={field.value}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#FFFFFF",
                },
              }}
              // onChange={(event) => {
              //   const value = Number(event.target.value);
              //   field.onChange(value);
              //   setFormState((prev) => ({
              //     ...prev,
              //     minValue: value,
              //   }));
              // }}
            >
              {/* {minOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))} */}
            </Select>
            {/* )}
          /> */}
          </Box>
          <Box> to </Box>
          <Box>
            {/* <Controller
            name="maxValue"
            control={control}
            render={({ field }) => ( */}
            <Select
              // value={field.value}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#FFFFFF",
                },
              }}
              // onChange={(event) => {
              //   const value = Number(event.target.value);
              //   field.onChange(value);
              //   setFormState((prev) => ({
              //     ...prev,
              //     maxValue: value,
              //   }));
              // }}
            >
              {/* {maxOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))} */}
            </Select>
            {/* )}
          /> */}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ScaleRangeSettings;
