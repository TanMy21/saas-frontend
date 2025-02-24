import { useEffect } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";
import { CiPercent } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoPlayCircleOutline } from "react-icons/io5";
import { MdDoneAll } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetInsightsQuery } from "../../app/slices/insightsApiSlice";
import { ErrorData } from "../../utils/types";
import InsightCard from "../Insights/InsightCard";

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
          height: "80%",
          // border: "2px solid green",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft: "1%",
                width: "96%",
                height: "16%",
                // border: "2px solid red",
              }}
            >
              <Typography sx={{ fontSize: "32px", fontStyle: "bold" }}>
                Insights
              </Typography>
              <Typography
                sx={{ fontSize: "20px", fontStyle: "bold", color: "#797F8D" }}
              >
                Performace and engagement metrics insights for your survey
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { sm: "96%", md: "96%", lg: "96%", xl: "94%" },
                height: "64%",
                margin: "auto",
                marginTop: "0%",
                gap: "2%",
                padding: "2%",
                // border: "2px solid blue",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "98%",
                  height: "48%",
                  gap: "2%",
                  // border: "2px solid orange",
                }}
              >
                <InsightCard
                  type={"NUMBER"}
                  title={"Views"}
                  value={views}
                  description={"Total views of your survey"}
                  icon={FiEye}
                  iconColor={"#2261EB"}
                />
                <InsightCard
                  type={"NUMBER"}
                  title={"Starts"}
                  value={starts}
                  description={"Total Number of survey starts"}
                  icon={IoPlayCircleOutline}
                  iconColor={"#CE4760"}
                />
                <InsightCard
                  type={"NUMBER"}
                  title={"Submissions"}
                  value={completions}
                  description={"Complete Submissions"}
                  icon={MdDoneAll}
                  iconColor={"#D8166D"}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "98%",
                  height: "48%",
                  gap: "2%",
                  // border: "2px solid purple",
                }}
              >
                <InsightCard
                  type={"PERCENTAGE"}
                  title={"Completion Rate"}
                  value={completionRate}
                  description={"Survey completion rate"}
                  icon={CiPercent}
                  iconColor={"#CD9010"}
                />
                <InsightCard
                  type={"TIME"}
                  title={"Submissions"}
                  value={averageCompletionTimeInMinutes}
                  description={"Average completion rate"}
                  icon={FaRegClock}
                  iconColor={"#079D3E"}
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ResultInsights;
