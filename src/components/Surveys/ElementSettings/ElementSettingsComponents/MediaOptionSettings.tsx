import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Switch,
} from "@mui/material";

const MediaOptionSettings = () => {
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
        <Box sx={{ fontWeight: 500, color: "#453F46" }}>Settings</Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0%",
          }}
        >
          <Box sx={{ fontWeight: 500 }}>Multiple selection</Box>
          <Box mt={1}>
            {/* <Controller
              name="multipleSelection"
              control={control}
              render={({ field }) => ( */}
            <Switch
            //   checked={field.value}
            //   onChange={(event) => {
            //     const value = event.target.checked;
            //     field.onChange(value);
            //     setFormState((prev) => ({
            //       ...prev,
            //       multipleSelection: value,
            //     }));
            //   }}
            />
            {/* )}
            /> */}
          </Box>
        </Box>
        <Box
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "0%",
          }}
        >
          <Box sx={{ fontWeight: 500 }}>Supersize</Box>
          <Box mt={1}>
            {/* <Controller
              name="superSize"
              control={control}
              render={({ field }) => ( */}
            <Switch
            //   checked={field.value}
            //   onChange={(event) => {
            //     const value = event.target.checked;
            //     field.onChange(value);
            //     setFormState((prev) => ({
            //       ...prev,
            //       superSize: value,
            //     }));
            //   }}
            />
            {/* )}
            /> */}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default MediaOptionSettings;
