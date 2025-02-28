import { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import { Box, Card, Grid, IconButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
} from "../../../app/slices/optionApiSlice";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";
import MediaElementCardContent from "../../MediaElementCard/MediaElementCardContent";
import MediaElementCardMedia from "../../MediaElementCard/MediaElementCardMedia";

import ElementQuestionText from "./ElementQuestionText";

const MediaElement = ({
  qID,
  qNO,
  qText,
  qType,
  qDescription,
  display,
}: ElementProps) => {
  const [open, setOpen] = useState(false);

  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  const btnContainerWidth = display === "mobile" ? "50%" : "20%";

  const [deleteOption] = useDeleteOptionMutation();

  const addMedia = async () => {
    const order = options ? options.length + 1 : 1;

    try {
      if (options.length < 10) {
        const nextCharCode = "A".charCodeAt(0) + options.length;
        const nextChoiceLetter = String.fromCharCode(nextCharCode);

        await createNewOption({
          questionID: qID,
          text: `${nextChoiceLetter}`,
          value: `Choice ${nextChoiceLetter}`,
          order,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteChoice = async (optionID: string) => {
    try {
      await deleteOption(optionID).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isError) {
      const errorData = error as ErrorData;
      if (Array.isArray(errorData.data.error)) {
        errorData.data.error.forEach((el) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error(errorData.data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError, error, options]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"92%"}
      minHeight={"100%"}
      zIndex={20}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "98%", marginTop: "4%" }}
      >
        <ElementQuestionText
          qID={qID}
          qNO={qNO}
          qText={qText}
          qType={qType}
          qDescription={qDescription}
          display={display}
        />
      </Box>
      <Box width={"96%"} minHeight={"60vh"} p={2}>
        <Grid
          container
          margin={"auto"}
          width={"80%"}
          spacing={3}
          columns={12}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
          sx={{ minHeight: "100%" }}
        >
          {options.map((option) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              key={option.optionID}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                padding: "0 !important",
                width: "160px",
                minHeight: "180px",
                marginBottom: "4%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "64%",
                  minHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: "auto",
                  padding: "1%",
                  gap: "4px",
                  borderRadius: "8px",
                  bgcolor: "#DFCF94",
                }}
              >
                <Box
                  sx={{
                    top: "12px",
                    margin: "auto",
                    width: "96%",
                    height: "120px",
                    maxHeight: "120px",
                    marginBottom: "4px",
                  }}
                >
                  <MediaElementCardMedia
                    open={open}
                    setOpen={setOpen}
                    optionID={option.optionID}
                    image={option.image}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    margin: "auto",
                    width: "96%",
                    minHeight: "50px",
                  }}
                >
                  <MediaElementCardContent text={option.text} option={option} />
                </Box>
              </Box>
              <IconButton
                className="close-button"
                onClick={() => deleteChoice(option.optionID)}
                z-index={10}
                sx={{
                  position: "relative",
                  top: "-50%",
                  right: "16%",
                  transform: "translateY(50,-50%)",
                  visibility: "visible",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                    visibility: "visible",
                  },
                }}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          ))}
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            sx={{ width: btnContainerWidth, margin: "auto", padding: "4px" }}
          >
            {/* Add Card Button */}
            {options.length < 5 && (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: {
                    xs: "100%",
                    sm: "90%",
                    md: "72%",
                    lg: 160,
                    xl: 180,
                  },
                  height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 184 },
                  marginTop: { lg: "12px", xl: "0px" },
                  border: "1px solid #DFCF94",
                  bgcolor: "#DFCF94",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  onClick={addMedia}
                  sx={{ width: "100%", height: "100%" }}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"90%"}
                    height={"76%"}
                  >
                    <IconButton>
                      <MdAdd color={"#745C07"} size={"48px"} />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
export default MediaElement;
