import { Grid, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../Users/userSlice";
import { getProjects } from "../Projects/projectSlice";
import { getTasksAsync } from "../Tasks/taskSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarComponent from "../../components/calendar";
import DashBoardChart from "./DashBoardChart";

function DashBoard() {
  const COLORS = ["#dce2e3", "#0088FE", "#FFBB28", "#00C49F", "#FF8042"];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers({ page: 1, limit: 1000 }));
    dispatch(getProjects({ page: 1, limit: 1000 }));
    dispatch(
      getTasksAsync({
        page: 1,
        limit: 1000,
      })
    );
  }, [dispatch]);

  const { status: userLoadingStatus, totalUsers } = useSelector(
    (state) => state.users
  );
  const {
    status: projectLoadingStatus,
    totalProjects,
    projectsById,
  } = useSelector((state) => state.projects);
  const {
    status: taskLoadingStatus,
    totalTasks,
    tasksById,
  } = useSelector((state) => state.tasks);

  const displayArrs = [
    {
      name: "Total Project",
      icon: (
        <AccountTreeOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `${totalProjects ? totalProjects : 0} `,
    },
    {
      name: "Total Task",
      icon: (
        <TaskOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `${totalTasks ? totalTasks : 0}`,
    },
    {
      name: "Total User",
      icon: (
        <PeopleAltOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `${totalUsers ? totalUsers : 0}`,
    },
  ];

  const dataArray = [
    { data: projectsById, title: "Project Status", colors: COLORS },
    { data: tasksById, title: "Task Status", colors: COLORS },
  ];

  if (
    userLoadingStatus !== "succeded" &&
    projectLoadingStatus !== "succeded" &&
    taskLoadingStatus !== "succeded"
  ) {
    return <LoadingScreen />;
  }
  return (
    <Stack
      spacing={5}
      sx={{ width: { xs: "265px", md: "800px", lg: "1000px", xl: "1200px" } }}
    >
      <Typography variant="h5" fontWeight="bold">
        Projects
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Stack direction="row" justifyContent="space-evenly" flexWrap="wrap">
            {displayArrs.map((item) => (
              <Paper
                elevation={5}
                sx={{ p: "10px", m: "20px" }}
                key={item.name}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "200px", height: "100px", p: "20px" }}
                >
                  {item.icon}

                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="end"
                  >
                    <Typography>{item.name}</Typography>
                    <Typography>{item.value}</Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
          <Stack spacing={2}>
            {dataArray.map((data, index) => (
              <DashBoardChart
                key={index}
                title={data.title}
                dataIn={data.data}
                COLORS={data.colors}
              />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <CalendarComponent />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashBoard;
