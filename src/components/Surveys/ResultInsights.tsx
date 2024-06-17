import { Box, Typography } from "@mui/material";
import { useGetInsightsQuery } from "../../app/slices/insightsApiSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { ErrorData } from "../../utils/types";
import { toast } from "react-toastify";

const ResultInsights = () => {
  const { surveyID } = useParams();

  const {
    data: results,
    isLoading,
    isError,
    error,
  } = useGetInsightsQuery(surveyID);

  const {
    views,
    starts,
    completions,
    completionRate,
    averageCompletionTimeInMinutes,
  } = results || {};

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
  }, [isError, error]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "auto",
          marginTop: "2%",
          width: "60%",
          height: "40%",
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
            width: { sm: "96%", md: "96%", lg: "96%", xl: "60%" },
            height: "64%",
            marginTop: "2%",
            gap: "2%",
            padding: "2%",
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
                fontWeight: 600,
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
                {views || 0}
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
                fontWeight: 600,
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
                {starts || 0}
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
                fontWeight: 600,
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
                {completions || 0}
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
                fontWeight: 600,
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
                {completionRate || 0}%
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
                fontWeight: 600,
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
                {averageCompletionTimeInMinutes || "00:00"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResultInsights;
