import TaskItem from "./TaskItem";

function TaskList({ tasks, dispatch }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} dispatch={dispatch} />
      ))}
    </ul>
  );
}

export default TaskList;