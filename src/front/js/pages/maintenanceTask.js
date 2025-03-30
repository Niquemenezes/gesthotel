import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";
import PrivateLayout from "../component/privateLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const MaintenanceTask = () => {
  const { store, actions } = useContext(Context);
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [condition, setCondition] = useState('PENDIENTE');
  const [idRoom, setIdRoom] = useState('');
  const [idMaintenance, setIdMaintenance] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    actions.getMaintenanceTasks();
    actions.getBranches();
    actions.getRooms();
    actions.getMaintenances();
    actions.getHousekeepers();
  }, []);

  const resetForm = () => {
    setNombre('');
    setPhoto('');
    setCondition('PENDIENTE');
    setIdRoom('');
    setIdMaintenance('');
    setEditingId(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!nombre || !idRoom || !idMaintenance) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    const payload = {
      nombre,
      photo_url: photo,
      condition,
      room_id: idRoom,
      maintenance_id: idMaintenance,
    };

    try {
      if (editingId) {
        await actions.updateMaintenanceTask(editingId, payload);
      } else {
        await actions.createMaintenanceTask(payload);
      }

      await actions.getMaintenanceTasks(); // recarga tareas
      resetForm();
    } catch (err) {
      console.error("Error al crear o actualizar tarea:", err);
    }
  };

  const editMaintenanceTask = (task) => {
    setNombre(task.nombre);
    setPhoto(task.photo_url || '');
    setCondition(task.condition || '');
    setIdRoom(task.room_id);
    setIdMaintenance(task.maintenance_id || '');
    setEditingId(task.id);
  };

  const cancelEdit = () => resetForm();

  const handleDelete = (id) => {
    if (window.confirm('¿Estás segura/o de que quieres eliminar esta tarea?')) {
      actions.deleteMaintenanceTask(id);
    }
  };

  const selectedMaintenance = store.maintenances?.find(m => m.id == idMaintenance);
  const filteredRooms = Array.isArray(store.rooms)
    ? store.rooms.filter(room => room.branch_id === selectedMaintenance?.branch_id)
    : [];

  const getTaskConditionForRoom = (roomId) => {
    const task = store.maintenanceTasks.find(t =>
      t.maintenance_id === parseInt(idMaintenance) && t.room_id === roomId
    );
    return task ? task.condition : null;
  };

  const getColorClassForCondition = (condition) => {
    switch (condition) {
      case 'PENDIENTE': return 'btn-danger';
      case 'EN PROCESO': return 'btn-warning';
      case 'FINALIZADA': return 'btn-success';
      default: return 'btn-outline-secondary';
    }
  };

  const toggleRoomSelection = (roomId) => {
    const existing = getTaskConditionForRoom(roomId);
    if (editingId || !existing) {
      setIdRoom(prev =>
        prev === roomId ? '' : roomId
      );
    }
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h1 className="my-4 text-center">Gestión de Tareas de Mantenimiento</h1>

        <div className="row">
          <div className="col-12 col-md-3 mb-4 d-flex justify-content-center">
            <div className="card shadow-sm w-100">
              <div className="card-body p-3">
                <h5 className="card-title text-center mb-3">{editingId ? 'Editar' : 'Crear'} Tarea</h5>
                <form>
                  <div className="form-group mb-3">
                    <label className="small">Técnico</label>
                    <select
                      className="form-control form-control-sm"
                      value={idMaintenance}
                      onChange={e => setIdMaintenance(e.target.value)}
                    >
                      <option value="">Selecciona un técnico</option>
                      {Array.isArray(store.maintenances) &&
                        store.maintenances.map(m => (
                          <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Habitación</label>
                    <div className="d-flex flex-wrap gap-2">
                      {filteredRooms.map(room => {
                        const condition = getTaskConditionForRoom(room.id);
                        const selected = idRoom == room.id;
                        const colorClass = condition
                          ? getColorClassForCondition(condition)
                          : selected
                            ? 'btn-primary'
                            : 'btn-outline-secondary';

                        return (
                          <button
                            key={room.id}
                            type="button"
                            className={`btn btn-sm ${colorClass}`}
                            onClick={() => toggleRoomSelection(room.id)}
                            disabled={!!condition && !editingId}
                            title={condition ? `Ya tiene tarea (${condition})` : 'Seleccionar'}
                          >
                            {room.nombre}
                          </button>
                        );
                      })}
                    </div>
                  </div>


                  <div className="form-group mb-2">
                    <label className="small">Tarea</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="small">Seleccionar archivo</label>
                    <CloudinaryApiHotel
                      setPhotoUrl={setPhoto}
                      setErrorMessage={setErrorMessage}
                    />

                    {!photo && (
                      <p className="text-muted small mt-1 mb-0">Ningún archivo seleccionado</p>
                    )}

                    {photo && (
                      <div className="mt-2 text-center">
                        <img
                          src={photo}
                          alt="preview"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Estado</label>
                    <select
                      className="form-control form-control-sm"
                      value={condition}
                      onChange={e => setCondition(e.target.value)}
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN PROCESO">EN PROCESO</option>
                      <option value="FINALIZADA">FINALIZADA</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <button type="button" className="btn btn-sm" style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }} onClick={handleCreateOrUpdate}>
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      {editingId ? "Actualizar" : "Crear"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={cancelEdit}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-9">
            <h4 className="mb-3">Tareas de Mantenimiento</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Sucursal</th>
                  <th>Habitación</th>
                  <th>Foto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(store.maintenanceTasks) &&
                  store.maintenanceTasks.map(task => {
                    const isReportedByHousekeeper = task.housekeeper_id !== null;

                    return (
                      <tr
                        key={task.id}
                        className={isReportedByHousekeeper ? "table-info" : ""}
                      >
                        <td>
                          {isReportedByHousekeeper
                            ? task.housekeeper?.nombre || "Camarera"
                            : task.maintenance?.nombre || "Técnico"}
                          {isReportedByHousekeeper && <span className="ms-1">🧹</span>}
                        </td>
                        <td>{task.nombre}</td>
                        <td>
                          <span className={`badge ${task.condition === 'PENDIENTE' ? 'bg-danger' :
                              task.condition === 'EN PROCESO' ? 'bg-warning text-dark' :
                                'bg-success'
                            }`}>
                            {task.condition}
                          </span>
                        </td>

                        <td>
                          {store.branches.find(branch => branch.id === task.room?.branch_id)?.nombre || "-"}
                        </td>
                        <td>{task.room_nombre || task.room?.nombre}</td>
                        <td>
                          {task.photo_url ? (
                            <img
                              src={task.photo_url}
                              alt="Incidencia"
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px"
                              }}
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
                            <FontAwesomeIcon icon={faPen} className="me-1" />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(task.id)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default MaintenanceTask;