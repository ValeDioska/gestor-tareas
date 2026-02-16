import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleTask, onDeleteTask, users }) {
  if (tasks.length === 0) return <p>No hay tareas en este proyecto</p>;

  return (
    <ul>
      {tasks.map((task) => {
        const user = users.find(u => u.id === task.usuario_id);
        return (
          <TaskItem
            key={task.id}
            task={{ ...task, usuario: user }}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
          />
        );
      })}
    </ul>
  );
}

export default TaskList;