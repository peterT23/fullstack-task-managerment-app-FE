import { Divider, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { Example } from "../../components/PieChart";
import CircleIcon from "@mui/icons-material/Circle";

function DashBoardChart({ title, dataIn, COLORS }) {
  return (
    <Paper elevation={5} sx={{ padding: "5px" }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      <Divider />
      <Stack direction="row" alignItems="center" flexWrap="wrap">
        <Stack>
          <Example dataIn={dataIn} colors={COLORS} />
        </Stack>
        <Stack>
          <Stack direction="row" spacing={2}>
            <CircleIcon sx={{ color: "#dce2e3" }} />
            <Typography>pending</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <CircleIcon sx={{ color: "#0088FE" }} />
            <Typography>ongoing</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <CircleIcon sx={{ color: "#FFBB28" }} />
            <Typography>review</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <CircleIcon sx={{ color: "#00C49F" }} />
            <Typography>done</Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <CircleIcon sx={{ color: "#FF8042" }} />
            <Typography>archive</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default DashBoardChart;
