function TaskItem({ task, dispatch }) {
  const handleToggle = () => {
    dispatch({ type: "TOGGLE_TASK", id: task.id });
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_TASK", id: task.id });
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <li className={`task-item ${task.done ? "done" : ""}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={handleToggle}
      />
      <div className="task-content">
        <span className="task-text">{task.text}</span>
        <div className="task-meta">
          {task.assignedTo && <span>Asignado a: {task.assignedTo}</span>}
          {formattedDate && <span>Fecha límite: {formattedDate}</span>}
        </div>
      </div>
      <button onClick={handleDelete}>Eliminar</button>
    </li>
  );
}

export default TaskItem;