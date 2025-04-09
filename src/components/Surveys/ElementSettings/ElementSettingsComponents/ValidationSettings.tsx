import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
} from "@mui/material";

const ValidationSettings = () => {
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
            color: "#453F46",
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: "#752FEC", fontSize: "20px" }} />
          Response Validation
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "96%",
            height: "80%",
            marginLeft: "4%",
            // border: "2px solid red",
          }}
        >
          <Box
            mt={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0%",
              width: "98%",
              height: "80%",
            }}
          >
            <Box sx={{ fontWeight: 500, color: "#3F3F46" }}>Required</Box>
            <Box mt={1}>
              {/* <Controller
              name="required"
              control={control}
              render={({ field }) => ( */}
              <Switch
              //   checked={field.value}
              //   onChange={(event) => {
              //     const value = event.target.checked;
              //     field.onChange(value);
              //     setFormState((prev) => ({
              //       ...prev,
              //       required: value,
              //     }));
              //   }}
              />
              {/* )}
            /> */}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ValidationSettings;
