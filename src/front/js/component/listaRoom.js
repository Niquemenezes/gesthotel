import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/sidebar";

const ListaRoom = () => {
  const { store, actions } = useContext(Context);
  const [nombre, setNombre] = useState("");
  const [branchId, setBranchId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  useEffect(() => {
    actions.getRooms();
    actions.getBranches(); // Para cargar las sucursales
  }, []);

  const resetForm = () => {
    setNombre("");
    setBranchId("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { nombre, branch_id: branchId };

    if (editingId) {
      await actions.createOrUpdateRoom(data, { id: editingId });
    } else {
      await actions.createOrUpdateRoom(data, null);
    }

    resetForm();
  };

  const handleEdit = (room) => {
    setNombre(room.nombre);
    setBranchId(room.branch_id || "");
    setEditingId(room.id);
    setShowForm(true);
  };

  const eliminarRoom = async (id) => {
    if (!window.confirm("¿Estás segura/o de que quieres eliminar esta habitación?")) return;
    setEliminando(id);
    await actions.deleteRoom(id);
    setEliminando(null);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container">
        <h2 className="text-center my-3">Lista de Habitaciones</h2>
        <div className="d-flex justify-content-center align-items-center mb-4">
  <button
    className="btn"
    style={{ backgroundColor: "#ac85eb", borderColor: "#B7A7D1" }}
    onClick={() => {
      resetForm();
      setShowForm(true);
    }}
  >
    Crear Habitación
  </button>
</div>

        <div className="row bg-light p-2 fw-bold border-bottom">
          <div className="col">Nombre</div>
          <div className="col">Sucursal</div>
          <div className="col text-center">Acciones</div>
        </div>

        {store.rooms.length === 0 ? (
          <div className="text-center p-3">No hay habitaciones registradas.</div>
        ) : (
          store.rooms.map((room) => (
            <div key={room.id} className="row p-2 border-bottom align-items-center">
              <div className="col">{room.nombre}</div>
              <div className="col">{room.branch || "Sin sucursal"}
              </div>
              <div className="col text-center">
                <button
                  className="btn me-2"
                  style={{ backgroundColor: "#ac85eb" }}
                  onClick={() => handleEdit(room)}
                >
                  Editar
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#ac85eb" }}
                  onClick={() => eliminarRoom(room.id)}
                  disabled={eliminando === room.id}
                >
                  {eliminando === room.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Formulario al final de la página */}
        {showForm && (
          <div className="card p-4 mt-5 mb-5">
            <h4 className="text-center mb-3">{editingId ? "Editar" : "Crear"} Habitación</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre de la habitación"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <select
                className="form-select mb-3"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
              >
                <option value="">Seleccione una sucursal</option>
                {store.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.nombre}
                  </option>
                ))}
              </select>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn" style={{ backgroundColor: "#ac85eb" }}>
                  {editingId ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default ListaRoom;
