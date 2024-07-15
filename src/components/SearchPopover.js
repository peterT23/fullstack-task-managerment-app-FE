import { IconButton, InputAdornment, Popover, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
const SearchPopover = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("filterName") || ""
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // handleSubmit(searchQuery);
    setSearchParams({ filterName: searchQuery });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <IconButton onClick={handleClick}>
        <SearchIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {/* <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          autoFocus
        /> */}
        <form onSubmit={onSubmit}>
          <TextField
            value={searchQuery}
            placeholder="Search by name"
            onChange={(event) => setSearchQuery(event.target.value)}
            sx={{ width: 300 }}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    color="primary"
                    aria-label="search by name"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Popover>
    </>
  );
};

export default SearchPopover;
