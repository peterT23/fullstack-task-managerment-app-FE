import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import SearchPopover from "../components/SearchPopover";

import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const MainHeader = ({ handleDrawerToggle }) => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logout(() => {
        navigate("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <Box sx={{ my: 1.5, px: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" noWrap>
          {user?.name}
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider sx={{ borderStyle: "dashed" }} />

      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/me/profile"
        sx={{ mx: 1 }}
      >
        <ManageAccountsOutlinedIcon sx={{ mr: 2 }} /> Profile Setting
      </MenuItem>
      <Divider sx={{ borderStyle: "dashed" }} />
      <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
        <LogoutOutlinedIcon sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 220px)` }, // drawerWidth is 240
          ml: { sm: `220px` },
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon color="primary" />
          </IconButton>
          <SearchPopover />
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Avatar
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  opacity: 0.8,
                },
              }}
              src={user.avatarUrl}
              alt={user.name}
              onClick={handleProfileMenuOpen}
            />
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default MainHeader;
