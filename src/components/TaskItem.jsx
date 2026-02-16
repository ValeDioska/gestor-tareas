function TaskItem({ task, onToggleTask, onDeleteTask }) {
  return (
    <li className="task-item">
      <div style={{ flex: 1 }}>
        <div>
          <span
            style={{
              textDecoration: task.done ? "line-through" : "none",
              fontWeight: 500,
            }}
          >
            {task.titulo}
          </span>
          <span className="badge" style={{ marginLeft: "1rem" }}>
            Vence: {task.fecha_limite}
          </span>
          <span className="badge" style={{ marginLeft: "0.5rem" }}>
            {task.usuario?.nombre || 'Sin asignar'}
          </span>
        </div>
        {task.descripcion && (
          <div className="task-description">
            {task.descripcion}
          </div>
        )}
      </div>
      <div>
        <button onClick={() => onToggleTask(task.id, task.done)}>
          {task.done ? "Desmarcar" : "Completar"}
        </button>
        <button
          className="eliminar"
          onClick={() => onDeleteTask(task.id)}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}

export default TaskItem;