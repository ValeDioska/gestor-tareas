import { useReducer, useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import UserForm from "./components/UserForm";
import { supabase } from "../supabase";
import "./App.css";

const initialState = {
  projects: [],
  users: [],
  selectedProjectId: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return {
        ...state,
        projects: action.payload.projects,
        users: action.payload.users,
        loading: false,
      };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        selectedProjectId: state.selectedProjectId === action.payload ? null : state.selectedProjectId,
      };
    case "SELECT_PROJECT":
      return {
        ...state,
        selectedProjectId: action.payload,
      };
    case "ADD_TASK": {
      const newTask = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === newTask.proyecto_id
            ? { ...project, tasks: [...(project.tasks || []), newTask] }
            : project
        ),
      };
    }
    case "TOGGLE_TASK": {
      const { taskId, projectId, done } = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === taskId ? { ...task, done } : task
                ),
              }
            : project
        ),
      };
    }
    case "DELETE_TASK": {
      const { taskId, projectId } = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== taskId),
              }
            : project
        ),
      };
    }
    case "SET_TASKS": {
      const { projectId, tasks } = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, tasks } : project
        ),
      };
    }
    case "ADD_USER":
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState("ALL");
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      const [projectsResult, usersResult] = await Promise.all([
        supabase.from("proyectos").select("*"),
        supabase.from("usuarios").select("*"),
      ]);

      if (projectsResult.error) console.error(projectsResult.error);
      if (usersResult.error) console.error(usersResult.error);

      const projects = (projectsResult.data || []).map(p => ({ ...p, tasks: [] }));
      dispatch({
        type: "SET_INITIAL_DATA",
        payload: { projects, users: usersResult.data || [] },
      });
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!state.selectedProjectId) return;

    async function loadTasks() {
      setLoadingTasks(true);
      const { data, error } = await supabase
        .from("tareas")
        .select("*")
        .eq("proyecto_id", state.selectedProjectId);
      if (error) console.error(error);
      else {
        const tasks = data.map(t => ({ ...t, done: t.estado === 'completada' }));
        dispatch({
          type: "SET_TASKS",
          payload: { projectId: state.selectedProjectId, tasks },
        });
      }
      setLoadingTasks(false);
    }
    loadTasks();
  }, [state.selectedProjectId]);

  const selectedProject = state.projects.find(
    (p) => p.id === state.selectedProjectId
  );

  const tasks = selectedProject ? selectedProject.tasks : [];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "DONE") return task.done;
    if (filter === "TODO") return !task.done;
    return true;
  });

  const handleAddProject = async (projectData) => {
    const { name, dueDate, description } = projectData;
    const { data, error } = await supabase
      .from("proyectos")
      .insert({ 
        nombre: name, 
        fecha_limite: dueDate, 
        descripcion: description
      })
      .select()
      .single();
    if (error) {
      alert("Error al crear proyecto: " + error.message);
      return;
    }
    dispatch({ type: "ADD_PROJECT", payload: { ...data, tasks: [] } });
  };

  const handleDeleteProject = async (projectId) => {
    const { error } = await supabase.from("proyectos").delete().eq("id", projectId);
    if (error) {
      alert("Error al eliminar proyecto: " + error.message);
      return;
    }
    dispatch({ type: "DELETE_PROJECT", payload: projectId });
  };

  const handleAddTask = async (taskData) => {
    if (!state.selectedProjectId) return;
    const { text, dueDate, assignedTo, description } = taskData;
    const user = state.users.find(u => u.nombre === assignedTo);
    if (!user) {
      alert("Usuario no encontrado");
      return;
    }
    const { data, error } = await supabase
      .from("tareas")
      .insert({
        titulo: text,
        descripcion: description,
        fecha_limite: dueDate,
        estado: "pendiente",
        proyecto_id: state.selectedProjectId,
        usuario_id: user.id,
      })
      .select()
      .single();
    if (error) {
      alert("Error al crear tarea: " + error.message);
      return;
    }
    const newTask = { ...data, done: false };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const handleToggleTask = async (taskId, currentDone) => {
    const nuevoEstado = currentDone ? "pendiente" : "completada";
    const { error } = await supabase
      .from("tareas")
      .update({ estado: nuevoEstado })
      .eq("id", taskId);
    if (error) {
      alert("Error al actualizar tarea: " + error.message);
      return;
    }
    dispatch({
      type: "TOGGLE_TASK",
      payload: { taskId, projectId: state.selectedProjectId, done: !currentDone },
    });
  };

  const handleDeleteTask = async (taskId) => {
    const { error } = await supabase.from("tareas").delete().eq("id", taskId);
    if (error) {
      alert("Error al eliminar tarea: " + error.message);
      return;
    }
    dispatch({
      type: "DELETE_TASK",
      payload: { taskId, projectId: state.selectedProjectId },
    });
  };

  const handleAddUser = async (userName) => {
    const { data, error } = await supabase
      .from("usuarios")
      .insert({ nombre: userName })
      .select()
      .single();
    if (error) {
      alert("Error al crear usuario: " + error.message);
      return;
    }
    dispatch({ type: "ADD_USER", payload: data });
  };

  if (state.loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="app">
      <h1>Gestor de Proyectos y Tareas</h1>
      
      <div className="app-container">
        <div className="sidebar">
          <h2>Proyectos</h2>
          <ProjectForm onAddProject={handleAddProject} />
          <ProjectList
            projects={state.projects}
            selectedId={state.selectedProjectId}
            onSelectProject={(id) => dispatch({ type: "SELECT_PROJECT", payload: id })}
            onDeleteProject={handleDeleteProject}
          />

          <h2 style={{ marginTop: "2rem" }}>Usuarios</h2>
          <UserForm onAddUser={handleAddUser} />
          <div className="user-list">
            {state.users.map(user => (
              <li key={user.id}>
                <span>{user.nombre}</span>
              </li>
            ))}
          </div>
        </div>

        <div className="main-content">
          {selectedProject ? (
            <>
              <h2>Tareas de: {selectedProject.nombre}</h2>
              {selectedProject.descripcion && (
                <p style={{ color: "var(--dark-light)", marginBottom: "1rem" }}>
                  {selectedProject.descripcion}
                </p>
              )}
              
              {loadingTasks && <div className="loading">Cargando tareas...</div>}
              
              <TaskForm onAddTask={handleAddTask} users={state.users} />
              
              <div className="filters">
                <button 
                  onClick={() => setFilter("ALL")}
                  className={filter === "ALL" ? "active" : ""}
                >
                  Todas
                </button>
                <button 
                  onClick={() => setFilter("TODO")}
                  className={filter === "TODO" ? "active" : ""}
                >
                  Pendientes
                </button>
                <button 
                  onClick={() => setFilter("DONE")}
                  className={filter === "DONE" ? "active" : ""}
                >
                  Completadas
                </button>
              </div>
              
              <TaskList
                tasks={filteredTasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                users={state.users}
              />
            </>
          ) : (
            <div className="loading">
              <p>Selecciona un proyecto para ver sus tareas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;