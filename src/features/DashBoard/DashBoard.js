import { Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../Users/userSlice";
import { getProjects } from "../Projects/projectSlice";
import { getTasksAsync } from "../Tasks/taskSlice";
import LoadingScreen from "../../components/LoadingScreen";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
function DashBoard() {
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
  const { status: projectLoadingStatus, totalProjects } = useSelector(
    (state) => state.projects
  );
  const { status: taskLoadingStatus, totalTasks } = useSelector(
    (state) => state.tasks
  );

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

  if (
    userLoadingStatus !== "succeded" &&
    projectLoadingStatus !== "succeded" &&
    taskLoadingStatus !== "succeded"
  ) {
    return <LoadingScreen />;
  }
  return (
    <Stack spacing={5}>
      <Typography variant="h5" fontWeight="bold">
        Projects
      </Typography>
      <Stack direction="row" justifyContent="space-evenly" flexWrap="wrap">
        {displayArrs.map((item) => (
          <Paper elevation={5} sx={{ p: "10px", m: "5px" }} key={item.name}>
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
    </Stack>
  );
}

export default DashBoard;
