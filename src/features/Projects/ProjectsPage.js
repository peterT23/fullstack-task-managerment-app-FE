import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import useAuth from "../../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";

function ProjectsPage() {
  const { user } = useAuth();
  const [openCreateNewProjectModal, setOpenCreateNewProjectModal] =
    useState(false);
  const handleOpenCreateNewProjectModal = () => {
    setOpenCreateNewProjectModal(true);
  };
  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Projects
      </Typography>

      <Stack direction="row" spacing={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="primary" to="/">
            Home
          </Link>
          <Typography color="text.primary">Projects</Typography>
        </Breadcrumbs>

        <Box flexGrow={1}></Box>

        {user.role === "manager" ? (
          <Tooltip
            title="Add Project"
            sx={{ backgroundColor: "primary", color: "white" }}
          >
            <Button
              variant="contained"
              onClick={handleOpenCreateNewProjectModal}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        ) : (
          ""
        )}
      </Stack>
    </Box>
  );
}

export default ProjectsPage;
