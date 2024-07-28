import { SortableContext } from "@dnd-kit/sortable";
import React from "react";

function TaskList({ tasks }) {
  return (
    <SortableContext items={tasks.map((task) => task._id)}></SortableContext>
  );
}

export default TaskList;
