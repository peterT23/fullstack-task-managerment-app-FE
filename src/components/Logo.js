import { Box } from "@mui/material";
import React from "react";
import logoImg from "../t.png";
import { Link as RouterLink } from "react-router-dom";

function Logo({ disableLink = false, sx }) {
  const logo = (
    <Box sx={{ width: 100, height: 100, ...sx }}>
      <img src={logoImg} alt="logo" width="100%" />
    </Box>
  );
  if (disableLink) return <>{logo}</>;
  return <RouterLink to="/">{logo}</RouterLink>;
}

export default Logo;
