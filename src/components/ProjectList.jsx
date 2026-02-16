function ProjectList({ projects, selectedId, onSelectProject, onDeleteProject }) {
  if (projects.length === 0) return <p>No hay proyectos</p>;

  return (
    <ul>
      {projects.map((project) => (
        <li 
          key={project.id}
          className={`project-item ${project.id === selectedId ? 'selected' : ''}`}
        >
          <div style={{ flex: 1 }}>
            <span onClick={() => onSelectProject(project.id)}>
              <strong>{project.nombre}</strong> (Vence: {project.fecha_limite})
            </span>
            {project.descripcion && (
              <div className="task-description">
                {project.descripcion}
              </div>
            )}
          </div>
          <button 
            className="eliminar"
            onClick={() => onDeleteProject(project.id)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProjectList;