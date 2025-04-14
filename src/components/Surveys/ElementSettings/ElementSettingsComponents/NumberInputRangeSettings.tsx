import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
  TextField,
} from "@mui/material";

const NumberInputRangeSettings = () => {
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
            color: "#453F46",
          }}
        >
          <LinearScaleIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          Input Range
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            marginLeft: "1%",
          }}
        >
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "96%",
              height: "80%",
              marginLeft: "4%",
            }}
          >
            <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Min number</Box>
            <Box mt={1}>
              {/* <Controller
                name="minSwitch"
                control={control}
                render={({ field }) => ( */}
              <Switch
              // checked={field.value}
              // onChange={(event) => {
              //   field.onChange(event.target.checked);
              //   setFormState((prev) => ({
              //     ...prev,
              //     minSwitch: event.target.checked,
              //   }));
              // }}
              />
              {/* )}
              /> */}
            </Box>
          </Box>
          {/* {formState.minSwitch && ( */}
          <Box mt={1} mb={1}>
            <Box>
              {/* <Controller
                  name="minValue"
                  control={control}
                  render={({ field }) => ( */}
              <TextField
                type="number"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                    height: "40px",
                    fontSize: "16px",
                  },
                }}
                //   {...field}
                //   onChange={(event) => {
                //     const value = Number(event.target.value);
                //     field.onChange(value);
                //     setFormState((prev) => ({
                //       ...prev,
                //       minValue: value,
                //     }));
                //   }}
              />
              {/* )}
                /> */}
            </Box>
          </Box>
          {/* )} */}
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "98%",
            }}
          >
            <Box sx={{ fontWeight: 500 }}>Max number</Box>
            <Box mt={1}>
              {/* <Controller
                name="maxSwitch"
                control={control}
                render={({ field }) => ( */}
              <Switch
              // checked={field.value}
              // onChange={(event) => {
              //   field.onChange(event.target.checked);
              //   setFormState((prev) => ({
              //     ...prev,
              //     maxSwitch: event.target.checked,
              //   }));
              // }}
              />
              {/* )}
              /> */}
            </Box>
          </Box>
          {/* {formState.maxSwitch && ( */}
          <Box mt={1}>
            <Box>
              {/* <Controller
                  name="maxValue"
                  control={control}
                  render={({ field }) => ( */}
              <TextField
                type="number"
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: 2,
                    backgroundColor: "#F9FAFB",
                    height: "40px",
                    fontSize: "16px",
                  },
                }}
                //   {...field}
                //   onChange={(event) => {
                //     const value = Number(event.target.value);
                //     field.onChange(value);
                //     setFormState((prev) => ({
                //       ...prev,
                //       maxValue: value,
                //     }));
                //   }}
              />
              {/* )}
                /> */}
            </Box>
          </Box>
          {/* )} */}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default NumberInputRangeSettings;
