import React, { useState, useEffect, useContext } from 'react';
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";
import { Context } from "../store/appContext";
import PrivateLayout from "../component/privateLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const HouseKeeperTask = () => {
  const { store, actions } = useContext(Context);
  const { housekeepers, rooms, houseKeeperTasks } = store;
  const [condition, setCondition] = useState('PENDIENTE');
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [submissionDate, setSubmissionDate] = useState('');
  const [idRoom, setIdRoom] = useState('');
  const [idHousekeeper, setIdHousekeeper] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    actions.getHousekeepers();
    actions.getRooms();
    actions.getHouseKeeperTasks();
  }, []);

  useEffect(() => {
    if (idHousekeeper) {
      const selectedHK = housekeepers.find(h => h.id == idHousekeeper);
      if (selectedHK) {
        const branchId = selectedHK.id_branche;
        const roomsOfBranch = rooms.filter(room => room.branch_id == branchId);
        setFilteredRooms(roomsOfBranch);
      }
    } else {
      setFilteredRooms([]);
    }
  }, [idHousekeeper, housekeepers, rooms]);

  const handleSubmit = async () => {
    if (!nombre || !assignmentDate || !submissionDate || !idRoom || !idHousekeeper) {
      alert('Por favor, completa todos los campos');
      return;
    }

    const data = {
      nombre,
      photo_url: photo,
      condition,
      assignment_date: assignmentDate,
      submission_date: submissionDate,
      id_room: idRoom,
      id_housekeeper: idHousekeeper
    };

    if (editingId) {
      await actions.updateHouseKeeperTask(editingId, data);
    } else {
      await actions.createHouseKeeperTask(data);
      await actions.getHouseKeeperTasks();
    }

    resetForm();
  };

  const editHouseKeeperTask = (id) => {
    const task = houseKeeperTasks.find((t) => t.id === id);
    if (task) {
      setNombre(task.nombre);
      setPhoto(task.photo_url);
      setCondition(task.condition || '');
      setAssignmentDate(task.assignment_date);
      setSubmissionDate(task.submission_date);
      setIdRoom(task.id_room);
      setIdHousekeeper(task.id_housekeeper);
      setEditingId(id);
    }
  };

  const deleteHouseKeeperTask = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      await actions.deleteHouseKeeperTask(id);
      await actions.getHouseKeeperTasks();
    }
  };

  const resetForm = () => {
    setNombre('');
    setPhoto('');
    setCondition('PENDIENTE');
    setAssignmentDate(new Date().toISOString().split('T')[0]);
    setSubmissionDate('');
    setIdRoom('');
    setIdHousekeeper('');
    setEditingId(null);
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h1 className="my-4 text-center">Gestión de Tareas de las Camareras de Piso</h1>

        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body p-3">
                <h5 className="card-title text-center mb-3">{editingId ? 'Editar' : 'Crear'} Tarea</h5>

                <div className="form-group">
                  <label className="small">Camarera de Piso</label>
                  <select
                    className="form-control form-control-sm mb-2"
                    value={idHousekeeper}
                    onChange={(e) => setIdHousekeeper(e.target.value)}
                    style={{ backgroundColor: "#0dcaf0", color: "white", border: "none", fontWeight: "bold" }}
                  >
                    <option value="">Selecciona una Camarera de piso</option>
                    {housekeepers.map((h) => (
                      <option key={h.id} value={h.id}>{h.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="small">Habitación</label>
                  <select
                    className="form-control form-control-sm mb-2"
                    value={idRoom}
                    onChange={(e) => setIdRoom(e.target.value)}
                    style={{ backgroundColor: "#0dcaf0", color: "white", border: "none", fontWeight: "bold" }}
                  >
                    <option value="">Selecciona una habitación</option>
                    {filteredRooms.map((room) => (
                      <option key={room.id} value={room.id}>{room.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="small">Tarea</label>
                  <input
                    className="form-control form-control-sm mb-2"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <CloudinaryApiHotel
                  setPhotoUrl={setPhoto}
                  setErrorMessage={(msg) => console.error("Error de Cloudinary:", msg)}
                />
                {photo && (
                  <img
                    src={photo}
                    alt="Preview"
                    className="my-2"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                  />
                )}

                <div className="form-group mt-2">
                  <label className="small">Estado</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="small">Fecha de Entrega</label>
                  <input
                    type="date"
                    className="form-control form-control-sm mb-2"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="btn btn-sm"
                    style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                    onClick={handleSubmit}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    {editingId ? 'Actualizar' : 'Crear'}
                  </button>

                  {editingId && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={resetForm}
                    >
                      <FontAwesomeIcon icon={faTimes} className="me-2" />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <h4 className="mb-3">Tareas de las Camareras de Piso</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Tarea</th>
                    <th>Estado</th>
                    <th>Asignación</th>
                    <th>Entrega</th>
                    <th>Habitación</th>
                    <th>Imagen</th>
                    <th>Camarera</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(houseKeeperTasks) && houseKeeperTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.nombre}</td>
                      <td>{task.condition}</td>
                      <td>{task.assignment_date}</td>
                      <td>{task.submission_date}</td>
                      <td>{task.room_nombre || task.id_room}</td>
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
                      <td>{task.housekeeper_nombre || task.id_housekeeper}</td>
                      <td>
                        <button
                          className="btn btn-sm me-2"
                          style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                          onClick={() => editHouseKeeperTask(task.id)}
                        >
                          <FontAwesomeIcon icon={faPen} className="me-1" />
                      
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteHouseKeeperTask(task.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                    
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default HouseKeeperTask;
