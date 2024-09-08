import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./SingleProject.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending", // Default status is "Pending"
  });

  const [columns, setColumns] = useState({
    pending: {
      name: "Pending",
      items: [
        {
          title: "Task 1",
          dueDate: "Fri Dec 22 2023",
          description: "Description for Task 1",
          status: "Pending",
        },
      ],
    },
    inProgress: {
      name: "In Progress",
      items: [],
    },
    done: {
      name: "Done",
      items: [],
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending", // Reset the new task fields
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.title.trim() && newTask.description.trim() && newTask.dueDate.trim()) {
      const updatedPendingTasks = [...columns.pending.items, newTask];
      setColumns({
        ...columns,
        pending: { ...columns.pending, items: updatedPendingTasks },
      });
      closeModal();
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const deleteTask = (index, columnId) => {
    const updatedItems = [...columns[columnId].items];
    updatedItems.splice(index, 1);
    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        items: updatedItems,
      },
    });
  };

  return (
    <div className="project-board">
      <div className="project-heading">
        <h1>Project name</h1>
        <button className="new-task-btn" onClick={openModal}>
          New Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-board">
          {Object.entries(columns).map(([columnId, column], index) => (
            <div className="task-column" key={columnId}>
              <h2>{column.name}</h2>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`task-list ${
                      snapshot.isDraggingOver ? "dragging-over" : ""
                    }`}
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={task.title}
                        draggableId={task.title}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                          >
                            <h3>{task.title}</h3>
                            <p>{task.dueDate}</p>
                            <p>Description: {task.description}</p>
                            <button
                              className="delete-btn"
                              onClick={() => deleteTask(index, columnId)}
                            >
                              🗑
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Modal for adding a new task */}
      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={newTask.title}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Enter description"
                value={newTask.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="submit-btn">Submit</button>
              <button type="button" onClick={closeModal} className="cancle-btn">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
