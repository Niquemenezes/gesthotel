import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";
import PrivateLayout from "../component/privateLayout";

const MaintenanceTask = () => {
  const { store, actions } = useContext(Context);
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [condition, setCondition] = useState('PENDIENTE');
  const [idRoom, setIdRoom] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [idMaintenance, setIdMaintenance] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    actions.getMaintenanceTasks();
    actions.getBranches();
    actions.getRooms();
    actions.getMaintenances();
    actions.getHousekeepers();
    actions.getRoomsByBranch();
  }, []);

  const resetForm = () => {
    setNombre('');
    setPhoto('');
    setCondition('PENDIENTE');
    setIdRoom('');
    setIdMaintenance('');
    setSelectedBranch('');
    setEditingId(null);
  };

  const handleCreateOrUpdate = () => {
    if (!nombre || !idRoom || !idMaintenance) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    const payload = {
      nombre,
      photo_url: photo,
      condition,
      room_id: idRoom,
      maintenance_id: idMaintenance || null,
    };

    if (editingId) {
      actions.updateMaintenanceTask(editingId, payload);
    } else {
      actions.createMaintenanceTask(payload);
    }

    resetForm();
  };

  const editMaintenanceTask = (task) => {
    setNombre(task.nombre);
    setPhoto(task.photo_url || '');
    setCondition(task.condition || '');
    setIdRoom(task.room_id);
    setIdMaintenance(task.maintenance_id || '');
    setSelectedBranch(task.room?.branch?.id || '');
    setEditingId(task.id);
  };

  const cancelEdit = () => resetForm();

  const handleDelete = (id) => {
    if (window.confirm('¿Estás segura/o de que quieres eliminar esta tarea?')) {
      actions.deleteMaintenanceTask(id);
    }
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h1 className="my-4 text-center">Gestión de Tareas de Mantenimiento</h1>

        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingId ? 'Editar' : 'Crear'} Tarea de Mantenimiento</h5>
            <form>
              <div className="form-group mb-2">
                <label>Tarea</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label>Foto (subir imagen)</label>
                <CloudinaryApiHotel
                  setPhotoUrl={setPhoto}
                  setErrorMessage={setErrorMessage}
                />
                {photo && (
                  <div className="mt-2">
                    <img src={photo} alt="preview" style={{ width: "100%", maxWidth: "300px", borderRadius: "10px" }} />
                  </div>
                )}
              </div>

              <div className="form-group mb-2">
                <label>Estado en que se encuentra</label>
                <input
                  type="text"
                  className="form-control"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                />
              </div>

              <div className="form-group mb-2">
                <label>Sucursal</label>
                <select
                  className="form-control" 
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    actions.getRoomsByBranch(e.target.value);
                  }}
                >
                  <option value="">Selecciona una sucursal</option>
                  {Array.isArray(store.branches) && store.branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-2">
                <label>Habitación</label>
                <select
                  className="form-control"
                  value={idRoom}
                  onChange={e => setIdRoom(e.target.value)}
                >
                  <option value="">Selecciona una habitación</option>
                  {Array.isArray(store.rooms) && store.rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Técnico de Mantenimiento</label>
                <select
                  className="form-control"
                  value={idMaintenance}
                  onChange={e => setIdMaintenance(e.target.value)}
                >
                  <option value="">Selecciona un técnico</option>
                  {Array.isArray(store.maintenances) && store.maintenances.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                onClick={handleCreateOrUpdate}
              >
                {editingId ? "Actualizar" : "Crear"} Tarea
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary ml-2"
                  onClick={cancelEdit}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>
        </div>

        <h2>Tareas de Mantenimiento</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Técnico</th>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Sucursal</th>
              <th>Habitación</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {Array.isArray(store.maintenanceTasks) && store.maintenanceTasks.map(task => (
              <tr key={task.id}>
                <td>{task.maintenance?.nombre || "-"}</td>
                <td>{task.nombre}</td>
                <td>{task.condition}</td>
                <td>{store.branches.find(branch => branch.id === task.room?.branch_id)?.nombre || "-"}</td>
                <td>{task.room_nombre || task.room?.nombre}</td>
                <td>
                  {task.photo_url ? (
                    <img
                      src={task.photo_url}
                      alt="Incidencia"
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <span className="text-muted">Sin foto</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm me-2"
                    style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                    onClick={() => editMaintenanceTask(task)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                    onClick={() => handleDelete(task.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PrivateLayout>
  );
};

export default MaintenanceTask;
