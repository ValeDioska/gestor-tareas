import { useState } from "react";

function UserForm({ onAddUser }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return alert("El nombre no puede estar vacío");
    onAddUser(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del usuario"
      />
      <button type="submit">Agregar Usuario</button>
    </form>
  );
}

export default UserForm;