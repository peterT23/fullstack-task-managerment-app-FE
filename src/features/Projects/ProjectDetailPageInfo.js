import { Paper, Stack, Typography } from "@mui/material";
import React from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
function ProjectDetailPageInfo({ currentProject }) {
  const startDate = new Date(currentProject.startDate);
  const dueDate = new Date(currentProject.dueDate);

  // Calculate the difference in time
  const timeDifference = dueDate - startDate;

  // Convert time difference from milliseconds to days
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  const displayArrs = [
    {
      name: "Days left",
      icon: (
        <CalendarMonthOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `${daysLeft} `,
    },
    {
      name: "Budget",
      icon: (
        <PaidOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `$${currentProject.budget}`,
    },
    {
      name: "Total Task",
      icon: (
        <AddTaskOutlinedIcon
          sx={{ width: "50px", height: "50px", color: "green" }}
        />
      ),
      value: `${currentProject.taskCount}`,
    },
  ];
  return (
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

            <Stack direction="column" justifyContent="center" alignItems="end">
              <Typography>{item.name}</Typography>
              <Typography>{item.value}</Typography>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default ProjectDetailPageInfo;
