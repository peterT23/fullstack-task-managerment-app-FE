import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Link as RouterLink, useParams } from "react-router-dom";

import ProjectDetailPageNameCard from "./ProjectDetailPageNameCard";
import ProjectDetailPageInfo from "./ProjectDetailPageInfo";
import ProjectDetailPageMemberDisplay from "./ProjectDetailPageMemberDisplay";
import { getSingleProject } from "./projectSlice";
import LoadingScreen from "../../components/LoadingScreen";

function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId;
  console.log(projectId);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getSingleProject({ projectId }));
  // }, [dispatch, projectId]);
  useEffect(() => {
    console.log("useEffect running", projectId);
    if (projectId) {
      dispatch(getSingleProject({ projectId }));
    }
  }, [dispatch, projectId]);

  const { selectedProject, status } = useSelector((state) => state.projects);

  const currentProject = selectedProject;

  return (
    <Box display="flex" flexDirection="column">
      {status === "loading" ? (
        <LoadingScreen />
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold">
            Project Detail
          </Typography>

          <Stack direction="column" spacing={5}>
            <Stack direction="row" spacing={2}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  component={RouterLink}
                  underline="hover"
                  color="primary"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  component={RouterLink}
                  underline="hover"
                  color="primary"
                  to="/projects"
                >
                  Project
                </Link>
                <Typography color="text.primary">Project Detail</Typography>
              </Breadcrumbs>
              <Box flexGrow={1}></Box>
              <Button variant="contained">Task Board</Button>
            </Stack>

            <ProjectDetailPageNameCard currentProject={currentProject} />
            <ProjectDetailPageInfo currentProject={currentProject} />
            <ProjectDetailPageMemberDisplay currentProject={currentProject} />
          </Stack>
        </>
      )}
    </Box>
  );
}

export default ProjectDetailPage;
