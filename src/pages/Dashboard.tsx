import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import { useGetSurveysQuery } from "../app/slices/surveysApiSlice";
import Workspaces from "../components/Workspaces";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";

import SurveysList from "../components/SurveysListMain";
import { useGetWorkspacesQuery } from "../app/slices/workspaceApiSlice";

const Dashboard = () => {
  const {
    data: workspaces,
    // isLoading: isLoadingWorkspaces,
    // isSuccess: isSuccessWorkspaces,
    // isError: isErrorWorkspaces,
    // error: workspaceError,
  } = useGetWorkspacesQuery("workspacesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  console.log("Dashboard: ", workspaces);

  return (
    <>
      <Grid container direction={"column"}>
        <Grid
          item
          xs={16}
          sx={{ background: "blue", height: "5vh", zIndex: "20" }}
        >
          <DashBoardHeader />
        </Grid>
        <Grid item container direction={"row"}>
          <Grid item sx={{ background: "red", height: "100vh", width: "12%" }}>
            <Paper
              elevation={1}
              square={true}
              style={{
                background: "white",
                height: "100vh",
                position: "sticky",
              }}
            >
              <Workspaces workspaces={workspaces} />
            </Paper>
          </Grid>
          <Grid
            item
            sx={{ background: "#FAFAFA", height: "100vh", width: "88%" }}
          >
            <Outlet context={{ workspaces }} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
