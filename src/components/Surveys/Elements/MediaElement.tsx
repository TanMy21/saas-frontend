import { useState } from "react";
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
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiImageAdd } from "react-icons/bi";
import { MdAdd } from "react-icons/md";

const MediaElement = ({ qNO }: ElementProps) => {
  const [media, setMedia] = useState(["A"]);

  const addMedia = () => {
    if (media.length < 26) {
      const nextCharCode = "A".charCodeAt(0) + media.length;
      const nextChoiceLetter = String.fromCharCode(nextCharCode);
      setMedia([...media, `${nextChoiceLetter}`]);
    }
  };

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
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mr={1}
        >
          <Typography variant="h4" fontWeight={"bold"} color={"black"}>
            {qNO}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mr={2}
        >
          <Typography variant="h6" mt={1}>
            <FaArrowRightLong />
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            variant="h3"
            fontStyle={"italic"}
            fontFamily={
              "BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
            }
          >
            Your question here.
          </Typography>
        </Box>
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
          {media.map((m, index) => (
            <Box
              key={index}
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
                      <Typography variant="subtitle2">{m}</Typography>
                    </Box>
                  </CardActions>
                </CardActionArea>
              </Card>
            </Box>
          ))}

          {/* Add Card Button */}

          <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "90%", md: "72%", lg: 160, xl: 180 },
                height: { xs: 150, sm: 170, md: 190, lg: 180, xl: 210 },
                marginTop: { lg: "12px" },
                border: "1px solid #DFCF94",
                bgcolor: "#DFCF94",
              }}
            >
              <Button onClick={addMedia} sx={{ width: "100%", height: "100%" }}>
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
        </Grid>
      </Box>
    </Box>
  );
};
export default MediaElement;
