import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import ContainerDroppable from "./ContainerDroppable";
import {
  arrayMove,
  insertAtIndex,
  removeAtIndex,
} from "../../../utils/arrayHandler";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  updateTaskStatusAndOrder,
  setDraggingState,
  resetDraggingState,
  updateAsyncTaskStatusAndOrder,
} from "../taskSlice";
import SortableTask from "./SortableTask";
import { getSingleProject } from "../../Projects/projectSlice";

function TaskContainer() {
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const tasksByStatus = useSelector((state) => state.tasks.tasksByStatus);
  const activeId = useSelector((state) => state.tasks.activeId);
  const isDragging = useSelector((state) => state.tasks.isDragging);
  const dispatch = useDispatch();
  const params = useParams();
  const { projectId } = params;

  useEffect(() => {
    dispatch(getSingleProject({ projectId }));
  }, [dispatch, projectId]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    return Object.keys(tasksByStatus).find((container) =>
      tasksByStatus[container].some((task) => task._id === id)
    );
  };

  const findTaskById = (id) => {
    for (const tasks of Object.values(tasksByStatus)) {
      for (const task of tasks) {
        if (task._id === id) {
          return task;
        }
      }
    }
    return null;
  };

  const moveBetweenContainers = (
    items,
    activeContainer,
    activeIndex,
    overContainer,
    overIndex,
    item
  ) => {
    return {
      ...items,
      [activeContainer]: removeAtIndex(items[activeContainer], activeIndex),
      [overContainer]: insertAtIndex(items[overContainer], overIndex, item),
    };
  };

  const handleDragStart = (event) => {
    const { active } = event;
    console.log("handleDragstart", event);
    dispatch(setDraggingState({ activeId: active.id }));
    const DragItem = findTaskById(active.id);
    setActiveDragItemData(DragItem);
  };

  const handleDragCancel = () => {
    dispatch(resetDraggingState());
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer !== overContainer) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in tasksByStatus
          ? tasksByStatus[overContainer].length + 1
          : over.data.current.sortable.index;

      const item = findTaskById(active.id);
      const newTasksByStatus = moveBetweenContainers(
        tasksByStatus,
        activeContainer,
        activeIndex,
        overContainer,
        overIndex,
        item
      );

      dispatch(updateTaskStatusAndOrder(newTasksByStatus));
      const updatedTasks = [
        //hàm naỳ cập nhật lại order ,index bên phía mất task
        ...newTasksByStatus[activeContainer].map((item, index) => ({
          ...item,
          order: index + 1,
          status: activeContainer,
        })),
        //hàm này cập nhật lại order,index  bên phía đem task vào
        ...newTasksByStatus[overContainer].map((item, index) => ({
          ...item,
          order: index + 1,
          status: overContainer,
        })),
      ];

      dispatch(updateAsyncTaskStatusAndOrder({ projectId, updatedTasks }));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      dispatch(resetDraggingState());
      return;
    }

    const activeContainer = findContainer(active.id);
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (
      active.id !== over.id ||
      active.id !== over.data.current?.sortable.containerId
    ) {
      let updatedTasks;
      let newTasksByStatus;
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in tasksByStatus
          ? tasksByStatus[overContainer].length + 1
          : over.data.current.sortable.index;

      if (activeContainer === overContainer) {
        const reorderedItems = arrayMove(
          tasksByStatus[overContainer],
          activeIndex,
          overIndex
        );
        newTasksByStatus = {
          ...tasksByStatus,
          [overContainer]: reorderedItems,
        };
        dispatch(updateTaskStatusAndOrder(newTasksByStatus));

        updatedTasks = reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1,
          status: activeContainer, // có thể cập nhật bằng status: overContainer
        }));

        dispatch(updateAsyncTaskStatusAndOrder({ projectId, updatedTasks }));
      } else {
        const item = findTaskById(active.id);
        const updatedItems = moveBetweenContainers(
          tasksByStatus,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          item
        );

        newTasksByStatus = updatedItems;
        dispatch(updateTaskStatusAndOrder(newTasksByStatus));
        //tuy nhiên order và status trong mỗi task chưa được updated chúng ta phải xử lý bằng cách lặp và lấy index,
        //  và id lần lượt gắn vào order và status

        updatedTasks = [
          //hàm naỳ cập nhật lại order ,index bên phía mất task
          ...updatedItems[activeContainer].map((item, index) => ({
            ...item,
            order: index + 1,
            status: activeContainer,
          })),
          //hàm này cập nhật lại order,index  bên phía đem task vào
          ...updatedItems[overContainer].map((item, index) => ({
            ...item,
            order: index + 1,
            status: overContainer,
          })),
        ];

        dispatch(updateAsyncTaskStatusAndOrder({ projectId, updatedTasks }));
      }

      dispatch(resetDraggingState());
    }
    setActiveDragItemData(null);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        overflowX: "auto",
        width: {
          xs: "310px",
          sm: "550px",
          md: "780px",
          lg: "1000px",
          xl: "1500px",
        },
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "1600px",
          }}
        >
          {Object.keys(tasksByStatus).map((containerId) => (
            <ContainerDroppable
              id={containerId}
              items={tasksByStatus[containerId]}
              activeId={activeId}
              key={containerId}
              column={containerId}
            />
          ))}
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {(!activeId || !isDragging) && null}
            {isDragging && (
              <SortableTask
                id={activeId}
                item={activeDragItemData}
                dragOverlay
              />
            )}
          </DragOverlay>
        </Box>

        <Box sx={{ height: "100px" }}></Box>
      </DndContext>
    </Box>
  );
}

export default TaskContainer;
