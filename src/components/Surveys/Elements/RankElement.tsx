import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ElementProps } from "../../../utils/types";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";

const RankElement = ({ qNO }: ElementProps) => {
  const [rankNumber, setRankNumber] = useState([1]);

  const addRank = () => {
    if (rankNumber.length <= 10) {
      const nextRank = rankNumber.length + 1;
      setRankNumber([...rankNumber, nextRank]);
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"start"}
      alignItems={"center"}
      margin={"auto"}
      width={"70%"}
      height={"100%"}
      zIndex={20}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ marginTop: "8%" }}>
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
      <Box>
        <Typography variant="h6" mt={1} color={"#0A49B1"}>
          Rank the following choices in order of preference.
        </Typography>
      </Box>
      <Box display={"flex"} flexDirection={"column"} mt={4}>
        {rankNumber.map((rank, index) => (
          <Button
            key={index}
            variant="outlined"
            size="large"
            sx={{ display: "flex", marginBottom: "8%" }}
          >
            <Box display={"flex"} flexDirection={"row"}>
              <Box>Rank &nbsp;</Box>
              <Box>{rank}</Box>
            </Box>
          </Button>
        ))}
      </Box>
      <Box mt={2}>
        {rankNumber.length < 10 && (
          <Button
            onClick={addRank}
            sx={{
              backgroundColor: "#0445AF",
              mr: 1,
              mb: 2,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#0445AF",
              },
            }}
            variant="contained"
            size="small"
          >
            Add Rank &nbsp;
            <MdAdd fontSize={"24px"} />
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default RankElement;
