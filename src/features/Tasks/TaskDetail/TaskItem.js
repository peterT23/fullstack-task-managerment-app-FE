import { Chip, Paper, Stack, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import React from "react";

const getStatusStyles = (status) => {
  switch (status) {
    case "low":
      return {
        backgroundColor: "#00C421",
        color: "white",
      };
    case "medium":
      return {
        backgroundColor: "#FFA200",
        color: "white",
      };
    case "high":
      return {
        backgroundColor: "#FF0080",
        color: "white",
      };
    default:
      return {
        backgroundColor: "grey",
        color: "white",
      };
  }
};
function TaskItem({ id, dragOverlay, item }) {
  return (
    <Paper
      sx={{
        cursor: dragOverlay ? "grabbing" : "grab",
        width: "100%",
        padding: "3px",
      }}
    >
      <Stack direction="column">
        <Stack direction="row">
          <Chip
            label={item?.priority}
            sx={{
              fontWeight: "bold",
              width: "50px",
              height: "25px",
              fontSize: "12px",
              ...getStatusStyles(item?.priority),
            }}
          />
        </Stack>
        <Typography>{item?.title}</Typography>
      </Stack>
    </Paper>
  );
}

export default TaskItem;
