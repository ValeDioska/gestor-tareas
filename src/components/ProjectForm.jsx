import { useState } from "react";

function ProjectForm({ onAddProject }) {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return alert("El nombre del proyecto no puede estar vacío");
    if (!dueDate) return alert("Debes asignar una fecha límite al proyecto");
    onAddProject({ name, dueDate, description });
    setName("");
    setDueDate("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del proyecto"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del proyecto"
        rows="3"
      />
      <button type="submit">Crear Proyecto</button>
    </form>
  );
}

export default ProjectForm;