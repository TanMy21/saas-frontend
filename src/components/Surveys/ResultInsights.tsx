import { Box, Typography } from "@mui/material";

const ResultInsights = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          width: "60%",
          height: "40%",
          border: "2px solid black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "64%",
            height: "16%",
          }}
        >
          <Typography sx={{ fontSize: "28px", fontStyle: "bold" }}>
            Insights
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "64%",
            height: "40%",
            marginTop: "2%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "12%",
              height: "96%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                margin: "auto",
                width: "98%",
                height: "28%",
                fontSize: "20px",
                color: "#353148",
              }}
            >
              Views
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "auto",
                width: "98%",
                height: "72%",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontStyle: "bold" }}>
                10
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "12%",
              height: "96%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                margin: "auto",
                width: "98%",
                height: "28%",
                fontSize: "20px",
                color: "#353148",
              }}
            >
              Starts
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "auto",
                width: "98%",
                height: "72%",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontStyle: "bold" }}>
                10
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "24%",
              height: "96%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                margin: "auto",
                width: "98%",
                height: "28%",
                fontSize: "20px",
                color: "#353148",
              }}
            >
              Submissions
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "auto",
                width: "98%",
                height: "72%",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontStyle: "bold" }}>
                10
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "26%",
              height: "96%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "auto",
                width: "98%",
                height: "28%",
                fontSize: "20px",
                color: "#353148",
              }}
            >
              Submission Rate
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "auto",
                width: "98%",
                height: "72%",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontStyle: "bold" }}>
                100 %
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "26%",
              height: "96%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                margin: "auto",
                width: "98%",
                height: "28%",
                fontSize: "20px",
                color: "#353148",
              }}
            >
              Time to complete
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                margin: "auto",
                width: "98%",
                height: "72%",
              }}
            >
              <Typography sx={{ fontSize: "40px", fontStyle: "bold" }}>
                00:00
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResultInsights;
