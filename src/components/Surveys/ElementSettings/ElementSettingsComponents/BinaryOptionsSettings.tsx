import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListIcon from "@mui/icons-material/List";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  TextField,
} from "@mui/material";

const BinaryOptionsSettings = () => {
  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0E0E0",
        borderRadius: 0,
        boxShadow: "none",
      }}
      defaultExpanded
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
          <ListIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          Options
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            height: "100%",
            marginLeft: "4%",
            // border: "2px solid orange",
          }}
        >
          <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Button 1</Box>
          <Box mt={1}>
            {/* <Controller
              name="button1Text"
              control={control}
              render={({ field }) => ( */}
            <TextField
              type="text"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                  height: "40px",
                  fontSize: "16px",
                },
              }}
              //   {...field}
              //   value={formState.button1Text}
              //   onChange={(event) => {
              //     const value = event.target.value;
              //     if (value.length <= 24) {
              //       field.onChange(value);
              //       setFormState((prev) => ({
              //         ...prev,
              //         button1Text: value,
              //       }));
              //       setInputLength1(value.length);
              //     }
              //   }}
              helperText={`${0}/24`}
            />
            {/* )}
            /> */}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            height: "100%",
            marginLeft: "4%",
            // border: "2px solid orange",
          }}
        >
          <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Button 2</Box>
          <Box mt={1}>
            {/* <Controller
              name="button2Text"
              control={control}
              render={({ field }) => ( */}
            <TextField
              type="text"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                  backgroundColor: "#F9FAFB",
                  height: "40px",
                  fontSize: "16px",
                },
              }}
              //   {...field}
              //   value={formState.button2Text}
              //   onChange={(event) => {
              //     const value = event.target.value;
              //     if (value.length <= 24) {
              //       field.onChange(value);
              //       setFormState((prev) => ({
              //         ...prev,
              //         button2Text: value,
              //       }));
              //       setInputLength2(value.length);
              //     }
              //   }}
              helperText={`${0}/24`}
            />
            {/* )}
            /> */}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default BinaryOptionsSettings;
