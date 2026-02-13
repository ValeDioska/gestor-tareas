import { useReducer, useState } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./App.css";

const initialState = [];

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload.text,
          done: false,
          dueDate: action.payload.dueDate || null,
          assignedTo: action.payload.assignedTo || ""
        }
      ];
    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.id ? { ...task, done: !task.done } : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.id);
    default:
      return state;
  }
}

function App() {
  const [tasks, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState("ALL");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "DONE") return task.done;
    if (filter === "TODO") return !task.done;
    return true; // ALL
  });

  return (
    <div className="app">
      <h1>Gestor de Tareas</h1>
      <TaskForm dispatch={dispatch} />
      <div className="filters">
        <button onClick={() => setFilter("ALL")}>Todas</button>
        <button onClick={() => setFilter("TODO")}>Pendientes</button>
        <button onClick={() => setFilter("DONE")}>Completadas</button>
      </div>
      <TaskList tasks={filteredTasks} dispatch={dispatch} />
    </div>
  );
}

export default App;