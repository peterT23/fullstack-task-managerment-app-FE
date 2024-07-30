import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "./userSlice";
import { useSearchParams } from "react-router-dom";
import SingleUserDisplay from "./SingleUserDisplay";
import LoadingScreen from "../../components/LoadingScreen";
import NewMemberCreateModal from "./NewMemberCreateModal";

function UsersPage() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const filterName = searchParams.get("filterName") || "";

  const [page, setPage] = useState(0);
  const [limitPerPage, setLimitPerPage] = useState(10);

  useEffect(() => {
    dispatch(getUsers({ page: page + 1, limit: limitPerPage, filterName }));
  }, [filterName, limitPerPage, page, dispatch]);

  const { currentPageUsers, usersById, totalUsers, status } = useSelector(
    (state) => state.users
  );
  const users = currentPageUsers.map((userId) => usersById[userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setLimitPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openCreateNewMemberModal, setOpenCreateNewMemberModal] =
    useState(false);

  const handleOpenCreateNewMemberModal = () => {
    setOpenCreateNewMemberModal(true);
  };
  const handleCloseCreateNewMemberModal = () => {
    setOpenCreateNewMemberModal(false);
  };

  const { user } = useAuth();

  return (
    <Box display="flex" flexDirection="column">
      <Typography variant="h5" fontWeight="bold">
        Manage Users
      </Typography>

      <Stack direction="row" spacing={2}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} underline="hover" color="primary" to="/">
            Home
          </Link>
          <Typography color="text.primary">Users</Typography>
        </Breadcrumbs>

        <Box flexGrow={1}></Box>

        {user.role === "manager" ? (
          <Tooltip
            title="Create New Member"
            sx={{ backgroundColor: "primary", color: "white" }}
          >
            <Button
              variant="contained"
              onClick={handleOpenCreateNewMemberModal}
            >
              <PersonAddAltOutlinedIcon />
            </Button>
          </Tooltip>
        ) : (
          ""
        )}
      </Stack>
      <Typography variant="subtitle" sx={{ color: "text.secondary", ml: 1 }}>
        {totalUsers > 1
          ? `${totalUsers} users found`
          : totalUsers === 1
          ? `${totalUsers} user found`
          : "No user found"}
      </Typography>
      <TablePagination
        sx={{
          "& .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon":
            {
              display: { xs: "none", md: "block" },
            },
        }}
        component="div"
        count={totalUsers ? totalUsers : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={limitPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
              width: 240,
              height: 300,
            },
          }}
        >
          {users.map((user) => (
            <SingleUserDisplay user={user} key={user._id} />
          ))}
        </Box>
      )}
      <NewMemberCreateModal
        openCreateNewMemberModal={openCreateNewMemberModal}
        handleCloseCreateNewMemberModal={handleCloseCreateNewMemberModal}
      />
    </Box>
  );
}

export default UsersPage;
