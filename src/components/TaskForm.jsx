import { useState } from "react";

function TaskForm({ onAddTask, users }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return alert("La tarea no puede estar vacía");
    if (!dueDate) return alert("Debes asignar una fecha límite");
    if (assignedTo.trim() === "") return alert("Debes asignar un usuario");
    onAddTask({ text, dueDate, assignedTo, description });
    setText("");
    setDueDate("");
    setAssignedTo("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tarea..."
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Seleccionar usuario</option>
        {users.map(user => (
          <option key={user.id} value={user.nombre}>{user.nombre}</option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción de la tarea"
        rows="2"
      />
      <button type="submit">Agregar Tarea</button>
    </form>
  );
}

export default TaskForm;