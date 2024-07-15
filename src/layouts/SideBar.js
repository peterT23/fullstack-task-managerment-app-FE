import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

import React from "react";
import Logo from "../components/Logo";
import DashBoard from "../features/DashBoard/DashBoard";
import UsersPage from "../features/Users/UsersPage";
import ProjectsPage from "../features/Projects/ProjectsPage";
import TasksPage from "../features/Tasks/TasksPage";
import { useLocation, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

const drawerWidth = 240;

const sideBarItems = [
  {
    name: "Dashboard",
    icon: <DashboardCustomizeOutlinedIcon />,
    path: "/",
    component: <DashBoard />,
  },
  {
    name: "Users",
    icon: <PeopleOutlinedIcon />,
    path: "/users",
    component: <UsersPage />,
  },
  {
    name: "Projects",
    icon: <AssignmentTurnedInOutlinedIcon />,
    path: "/projects",
    component: <ProjectsPage />,
  },
  {
    name: "Tasks",
    icon: <FormatListBulletedOutlinedIcon />,
    path: "/tasks",
    component: <TasksPage />,
  },
];

function SideBar({ window, setIsClosing, mobileOpen, setMobileOpen }) {
  // const [currentItem, setCurrentItem] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleItemClick = (name, path) => {
    navigate(path);
    // setCurrentItem(name);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Logo />
      <List>
        {sideBarItems.map((item, index) => (
          <ListItem
            key={`${item.name}+${index}`}
            selected={location.pathname === item.path}
            disablePadding
            onClick={() => handleItemClick(item.name, item.path)}
          >
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
SideBar.propTypes = {
  window: PropTypes.func,
};

export default SideBar;
