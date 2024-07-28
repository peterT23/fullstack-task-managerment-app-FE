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
import React, { useState } from "react";

import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import ContainerDroppable from "./ContainerDroppable";

import {
  arrayMove,
  insertAtIndex,
  removeAtIndex,
} from "../../../utils/arrayHandler";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateTaskStatusAndOrder } from "../taskSlice";
import SortableTask from "./SortableTask";

function TaskContainer({ tasksByStatus }) {
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [containerGroup, setContainerGroup] = useState(tasksByStatus);
  const dispatch = useDispatch();
  const params = useParams();
  const { projectId } = params;

  //DND Handler

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id) => {
    return Object.keys(containerGroup).find((container) =>
      containerGroup[container].some((task) => task._id === id)
    );
  };

  //lấy object chứa task có id trùng với activeId đưa ra item để sử dụng trong moveBetweenArr
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
  // save activeId to know which one has been dragged
  const handleDragStart = (event) => {
    const { active } = event;
    setIsDragging(true);
    setActiveId(active.id);
  };
  //
  const handleDragCancel = () => {
    setActiveId(null);
  };
  //
  const handleDragOver = (event) => {
    console.log("handleOver", event);
    const { active, over } = event;
    // console.log("handleDragOver", event);
    const overId = over?.id;
    // trường hợp này xảy ra khi draggable item bị kéo ra khỏi khu vực Droppable
    if (!overId) {
      return;
    }
    // const activeContainer = active.data.current?.sortable.containerId;
    const activeContainer = findContainer(active.id);
    console.log("handle over activeContainer", activeContainer);
    const overContainer = over.data.current?.sortable.containerId || over.id;
    // const overContainer = findContainer(over.id);
    console.log("handle over overContainer", overContainer);
    //trường hợp di chuyển từ 1 droppable container  đến 1 droppable container khác
    //xử lý index,vị trí của draggable item,
    if (activeContainer !== overContainer) {
      setContainerGroup((containerGroup) => {
        const activeIndex = active.data.current.sortable.index;
        console.log("handle over activeIndex", activeIndex);
        const overIndex =
          over.id in containerGroup
            ? containerGroup[overContainer].length + 1
            : over.data.current.sortable.index;
        console.log("handle over overIndex", overIndex);

        const item = findTaskById(active.id);
        return moveBetweenContainers(
          containerGroup,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          item
        );
      });
    }
  };
  //
  const handleDragEnd = (event) => {
    console.log("handleDragEnd", event);

    const { active, over } = event;

    // trường hợp này kéo draggable item ra bên ngoài droppable area

    if (!over) {
      setActiveId(null);
      return;
    }

    // lấy giá trị của active container, overcontainer để xử lý logic

    // console.log("activeId", activeId);
    // console.log("activeContainer handleEnd", activeContainer);
    // const activeContainer = active.data.current?.sortable.containerId;

    //trường hợp drag item trong cùng 1 container. hoặc khác container
    if (
      active.id !== over.id ||
      active.id !== over.data.current?.sortable.containerId
    ) {
      let updatedTasks;
      // console.log("handle end activeContainer", activeContainer);
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeContainer = findContainer(activeId);
      // console.log("handle end overContainer", overContainer);
      const activeIndex = active.data.current.sortable.index;
      const overIndex =
        over.id in containerGroup
          ? containerGroup[overContainer].length + 1
          : over.data.current.sortable.index;

      //trường hợp này drag item và đổi vị trí trong cùng 1 container
      if (activeContainer === overContainer) {
        //lấy giá trị mới được trả về sau khi sắp xếp laị vị trí dùng hàm arraymove của dnd-kit
        //trong đây overcontainer và active container là 1 , và có thể là pending arr, ongoing arr,....
        // hàm này trả về giá trị của arr mới sau khi được drop item
        const reorderedItems = arrayMove(
          containerGroup[overContainer], // containerGroup[activeContainer]
          activeIndex,
          overIndex
        );

        //sau khi drop item cập nhật lại order,status của task
        //destructure reordered item lấy gía trị index+1. vì order bắt đầu từ 1,
        // console.log("reorderedItems", reorderedItems);
        updatedTasks = reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1,
          status: activeContainer, // có thể cập nhật bằng status: overContainer
        }));
        console.log("updatedTask1", updatedTasks);

        dispatch(updateTaskStatusAndOrder({ projectId, updatedTasks }));
      }
      if (activeContainer !== overContainer) {
        // tìm task bị drag qua container khác chỗ nào lấy task ra thì xoá bỏ trong cột status đó,
        // chỗ nào drop vào thì insert thêm vào trong cột status mới
        const item = findTaskById(active.id);
        //dùng hàm moveBetweenContainers để cập nhật lại 1 containerGroups mới

        const updatedItems = moveBetweenContainers(
          containerGroup,
          activeContainer,
          activeIndex,
          overContainer,
          overIndex,
          item
        );

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
        dispatch(updateTaskStatusAndOrder({ projectId, updatedTasks }));
      }

      // cập nhật lại containerGroup  {pending:[],ongoing:[].....}

      setContainerGroup((prevState) => ({
        ...prevState,
        ...updatedTasks.reduce((acc, task) => {
          acc[task.status] = acc[task.status] || [];
          acc[task.status].push(task);
          return acc;
        }, {}),
      }));
    }
    setActiveId(null);
    setIsDragging(false);
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
          {Object.keys(containerGroup).map((containerId) => (
            <ContainerDroppable
              id={containerId}
              items={containerGroup[containerId]}
              activeId={activeId}
              key={containerId}
              column={containerId}
            />
          ))}
        </Box>
        <Box sx={{ height: "100px" }}></Box>
        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {/* {activeId ? <TaskItem id={activeId} dragOverlay /> : null} */}
          {isDragging && <SortableTask id={activeId} dragOverlay />}
        </DragOverlay>
      </DndContext>
    </Box>
  );
}

export default TaskContainer;
