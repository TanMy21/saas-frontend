import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import SurveyCardDropDownMenu from "./SurveyCardDropDownMenu";
import { useNavigate } from "react-router-dom";

const GridLayout = ({ surveys, workspaceId, layout }) => {
  console.log("GridLayout surveys", layout);
  const navigate = useNavigate();

  const goToSurvey = () => {
    navigate("/survey/123/create", { state: { workspaceId, layout } });
  };

  return (
    <>
      {surveys?.map((survey) => (
        <Grid item xs={2} sm={4} md={4} key={survey.surveyID}>
          <Card sx={{ width: "180px", height: "210px" }}>
            <ButtonBase
              onClick={goToSurvey}
              sx={{
                width: "100%", // Ensures the ButtonBase fills its container
                display: "block", // Makes the ButtonBase behave as a block element to wrap the Card
                textTransform: "none", // Prevents text transformation globally within the ButtonBase
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "center",
                  marginBottom: "24%",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "90%",
                    height: "80%",
                  }}
                  mt={8}
                >
                  <Typography sx={{ fontSize: "16px" }} noWrap>
                    {survey.title}
                  </Typography>
                </Box>
              </CardContent>
            </ButtonBase>
            <Divider />
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Box p={"6px"} mt={1} pl={1}>
                <Typography sx={{ fontSize: "12px", color: "#C1C1D3" }}>
                  No Responses
                </Typography>
              </Box>
              <Box sx={{ marginTop: "-2%" }}>
                <CardActions>
                  <SurveyCardDropDownMenu survey={survey} />
                </CardActions>
              </Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default GridLayout;
