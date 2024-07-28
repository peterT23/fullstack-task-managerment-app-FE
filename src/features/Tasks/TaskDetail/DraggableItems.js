import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

function DraggableItems(itemsProps) {
  const { id, title } = itemsProps;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: { ...itemsProps },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
    >
      <Box sx={{ opacity: isDragging ? "0.5" : "unset" }}>
        <Typography>{title}</Typography>
        <Button {...listeners}>DragHandle</Button>
      </Box>
    </div>
  );
}

export default DraggableItems;
