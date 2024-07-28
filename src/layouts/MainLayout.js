import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { Outlet } from "react-router-dom";

import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { Toolbar } from "@mui/material";
import { useState } from "react";

import SideBar from "./SideBar";
import AlertMsg from "../components/AlertMsg";

function MainLayout(props) {
  // const handleChangeItem = (newValue) => {
  //   setCurrentItem(newValue);
  // };

  // const [highlightIndex, setHighlightIndex] = React.useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const drawerWidth = 240;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SideBar
        setIsClosing={setIsClosing}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <MainHeader handleDrawerToggle={handleDrawerToggle} />
      <AlertMsg />
      <Box
        component="main"
        sx={{
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        <Outlet />
        <Box flexGrow={1}></Box>
        <MainFooter />
      </Box>
    </Box>
  );
}

export default MainLayout;
