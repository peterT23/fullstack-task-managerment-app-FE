import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

import { Link as RouterLink, useParams } from "react-router-dom";

import ProjectDetailPageNameCard from "./ProjectDetailPageNameCard";
import ProjectDetailPageInfo from "./ProjectDetailPageInfo";
import ProjectDetailPageMemberDisplay from "./ProjectDetailPageMemberDisplay";

function ProjectDetailPage() {
  const { projectId } = useParams();

  const { projectsById } = useSelector((state) => state.projects);

  const currentProject = projectsById[projectId];

  return (
    <Box display="flex" flexDirection="column">
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
    </Box>
  );
}

export default ProjectDetailPage;
