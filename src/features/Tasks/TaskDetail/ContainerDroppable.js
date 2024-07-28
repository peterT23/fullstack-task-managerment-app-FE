import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import {
  Box,
  capitalize,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SortableTask from "./SortableTask";
function ContainerDroppable({ id, items, column }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Paper
      elevation={10}
      sx={{
        width: "280px",
        borderRadius: "5px",
        m: "20px",
        padding: "10px",
      }}
    >
      <Stack direction="row" justifyContent="space-between" sx={{ padding: 2 }}>
        <Typography fontWeight="bold">{capitalize(String(column))}</Typography>
        <Typography color="primary">{items.length}</Typography>
      </Stack>
      <Divider sx={{ mb: "10px" }} />
      <Box ref={setNodeRef}>
        <Stack direction="column" spacing={3} alignItems="center">
          <SortableContext
            id={id}
            items={items.map((item) => item._id)}
            strategy={rectSortingStrategy}
          >
            {items.map((item) => (
              <SortableTask key={item._id} id={item._id} item={item} />
            ))}
          </SortableContext>
        </Stack>
      </Box>
    </Paper>
  );
}

export default ContainerDroppable;
