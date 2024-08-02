import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Link,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import useAuth from "../../hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";

import { useDispatch, useSelector } from "react-redux";
import { getProjects } from "./projectSlice";
import ProjectDisplayCard from "./ProjectDisplayCard";
import NewProjectCreateModal from "./Modal/NewProjectCreateModal";

function ProjectsPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const filterName = searchParams.get("filterName") || "";
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedButton, setSelectedButton] = useState("All");
  const [page, setPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    if (buttonName === "all") {
      setFilterStatus("");
    }
    buttonName = buttonName.toLowerCase();
    setFilterStatus(buttonName);
  };

  useEffect(() => {
    dispatch(
      getProjects({
        page: page + 1,
        limit: limitPerPage,
        filterName,
        filterStatus,
      })
    );
  }, [filterName, limitPerPage, page, filterStatus, dispatch]);

  const { currentPageProjects, projectsById, totalProjects, status } =
    useSelector((state) => state.projects);

  const projects = currentPageProjects.map(
    (projectId) => projectsById[projectId]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setLimitPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openCreateNewProjectModal, setOpenCreateNewProjectModal] =
    useState(false);
  const handleOpenCreateNewProjectModal = () => {
    setOpenCreateNewProjectModal(true);
  };
  const handleCloseCreateNewProjectModal = () => {
    setOpenCreateNewProjectModal(false);
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
      <Typography variant="subtitle" sx={{ color: "text.secondary", ml: 1 }}>
        {totalProjects > 1
          ? `${totalProjects} projects found`
          : totalProjects === 1
          ? `${totalProjects} project found`
          : "No project found"}
      </Typography>

      <TablePagination
        sx={{
          "& .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              display: { xs: "none", md: "block" },
            },
        }}
        component="div"
        count={totalProjects ? totalProjects : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limitPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ButtonGroup
        aria-label="Basic button group"
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {["All", "Pending", "Ongoing", "Review", "Done", "Archive"].map(
          (buttonName) => (
            <Button
              key={buttonName}
              variant={selectedButton === buttonName ? "contained" : "outlined"}
              onClick={() => handleButtonClick(buttonName)}
            >
              {buttonName}
            </Button>
          )
        )}
      </ButtonGroup>

      {status === "loading" ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",

            "& > :not(style)": {
              m: 1,
              width: 230,
              height: 300,
            },
          }}
        >
          {projects.map((project) => (
            <ProjectDisplayCard project={project} key={project._id} />
          ))}
        </Box>
      )}
      <NewProjectCreateModal
        open={openCreateNewProjectModal}
        handleClose={handleCloseCreateNewProjectModal}
      />
    </Box>
  );
}

export default ProjectsPage;
