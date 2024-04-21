import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { ElementProps, ErrorData, OptionType } from "../../../utils/types";
import { BiImageAdd } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";
import ElementQuestionText from "./ElementQuestionText";
import {
  useCreateNewOptionMutation,
  useDeleteOptionMutation,
  useGetOptionsOfQuestionQuery,
} from "../../../app/slices/optionApiSlice";
import { toast } from "react-toastify";

const MediaElement = ({ qID, qNO, qText }: ElementProps) => {
  // const [editingID, setEditingID] = useState<string | null>(null);

  const { data: options = [] as OptionType[] } =
    useGetOptionsOfQuestionQuery(qID);

  const [createNewOption, { isError, error }] = useCreateNewOptionMutation();

  // const [updateOptionTextandValue] = useUpdateOptionTextandValueMutation();

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
          value: `${nextChoiceLetter}`,
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
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "4%" }}>
        <ElementQuestionText qID={qID} qNO={qNO} qText={qText} />
      </Box>
      <Box width={"96%"} minHeight={"60vh"} p={2}>
        <Grid
          container
          margin={"auto"}
          width={"100%"}
          height={"100%"}
          spacing={"8px"}
          columns={12}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"center"}
        >
          {options.map((option) => (
            <Box
              key={option.optionID}
              sx={{
                p: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: 180,
                height: 210,
                marginRight: "4px",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "100%", sm: "90%", md: "72%", lg: 160, xl: 180 },
                  height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 210 },
                  border: "1px solid #DFCF94",
                  bgcolor: "#DFCF94",
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"90%"}
                  height={"76%"}
                  border={"2px solid #E4BD34"}
                  bgcolor={"#E4BD34"}
                  mt={1}
                >
                  <IconButton>
                    <BiImageAdd color={"#745C07"} size={"48px"} />
                  </IconButton>
                </Box>
                <CardActionArea
                  sx={{
                    height: "20%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "24px",
                        height: "24px",
                        bgcolor: "white",
                        borderRadius: "2px",
                      }}
                    >
                      <Typography variant="subtitle2">{option.text}</Typography>
                    </Box>
                  </CardActions>
                </CardActionArea>
              </Card>
              <IconButton
                className="close-button"
                onClick={() => deleteChoice(option.optionID)}
                z-index={10}
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: "-12px",
                  transform: "translateY(-20%)",
                  // visibility: "hidden",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
              >
                <ClearIcon />
              </IconButton>
            </Box>
          ))}

          {/* Add Card Button */}
          {options.length < 10 && (
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xs: "100%", sm: "90%", md: "72%", lg: 160, xl: 180 },
                  height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 210 },
                  marginTop: { lg: "12px", xl: "0px" },
                  border: "1px solid #DFCF94",
                  bgcolor: "#DFCF94",
                }}
              >
                <Button
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
                </Button>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};
export default MediaElement;
