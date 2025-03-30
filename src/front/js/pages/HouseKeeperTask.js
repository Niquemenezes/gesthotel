import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import PrivateLayout from "../component/privateLayout";
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const HouseKeeperTask = () => {
  const { store, actions } = useContext(Context);
  const { housekeepers = [], rooms = [], houseKeeperTasks = [], branches = [] } = store;

  const [condition, setCondition] = useState('PENDIENTE');
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [submissionDate, setSubmissionDate] = useState('');
  const [idRoom, setIdRoom] = useState('');
  const [idHousekeeper, setIdHousekeeper] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    actions.getHousekeepers();
    actions.getBranches();
    actions.getRooms();
    actions.getHouseKeeperTasks();
  }, []);

  const filteredRooms = idHousekeeper
    ? rooms.filter(room => {
        const hk = housekeepers.find(h => h.id == idHousekeeper);
        return hk ? room.branch_id === hk.id_branche : false;
      })
    : [];

  const handleHousekeeperChange = (idHK) => {
    setIdHousekeeper(idHK);
    setIdRoom('');
  };

  const handleSubmit = async () => {
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
    }

    await actions.getHouseKeeperTasks();
    resetForm();
  };

  const editHouseKeeperTask = (id) => {
    const task = houseKeeperTasks.find(t => t.id === id);
    if (task) {
      setEditingId(task.id);
      setNombre(task.nombre);
      setPhoto(task.photo_url);
      setCondition(task.condition);
      setAssignmentDate(task.assignment_date);
      setSubmissionDate(task.submission_date);
      setIdHousekeeper(task.id_housekeeper);
      setIdRoom(task.id_room);
    }
  };

  const deleteHouseKeeperTask = async (id) => {
    if (window.confirm("¿Eliminar esta tarea?")) {
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
        <h1 className="my-4 text-center">Gestión de Tareas de Camareras</h1>
        <div className="row">
          <div className="col-12 col-md-3 mb-4 d-flex justify-content-center">
            <div className="card shadow-sm w-100">
              <div className="card-body p-3">
                <h5 className="card-title text-center mb-3">{editingId ? "Editar" : "Crear"} Tarea</h5>
                <form>
                  <div className="form-group mb-2">
                    <label className="small">Camarera</label>
                    <select className="form-control form-control-sm" value={idHousekeeper} onChange={(e) => handleHousekeeperChange(e.target.value)}>
                      <option value="">Selecciona una camarera</option>
                      {housekeepers.map(h => (
                        <option key={h.id} value={h.id}>{h.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Habitación</label>
                    <select className="form-control form-control-sm" value={idRoom} onChange={(e) => setIdRoom(e.target.value)}>
                      <option value="">Selecciona habitación</option>
                      {filteredRooms.map(room => (
                        <option key={room.id} value={room.id}>{room.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Tarea</label>
                    <input className="form-control form-control-sm" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>

                  <div className="form-group mb-3">
                    <label className="small">Foto</label>
                    <CloudinaryApiHotel setPhotoUrl={setPhoto} setErrorMessage={setErrorMessage} />
                    {photo && <img src={photo} alt="preview" className="img-fluid mt-2" style={{ width: 80, borderRadius: 10 }} />}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Estado</label>
                    <select className="form-control form-control-sm" value={condition} onChange={(e) => setCondition(e.target.value)}>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN PROCESO">EN PROCESO</option>
                      <option value="FINALIZADA">FINALIZADA</option>
                    </select>
                  </div>

                  <div className="form-group mb-2">
                    <label className="small">Entrega</label>
                    <input type="date" className="form-control form-control-sm" value={submissionDate} onChange={(e) => setSubmissionDate(e.target.value)} />
                  </div>

                  <div className="d-flex justify-content-between mt-2">
                    <button type="button" className="btn btn-sm" style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }} onClick={handleSubmit}>
                      <FontAwesomeIcon icon={faSave} className="me-1" />
                      {editingId ? "Actualizar" : "Crear"}
                    </button>
                    {editingId && (
                      <button className="btn btn-sm btn-outline-secondary" onClick={resetForm}>
                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-9">
            <h4 className="mb-3">Tareas de Camareras</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Camarera</th>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th>Habitación</th>
                  <th>Sucursal</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(houseKeeperTasks) && houseKeeperTasks.map(task => (
                  <tr key={task.id}>
                    <td>{housekeepers.find(h => h.id === task.id_housekeeper)?.nombre || <span className="text-muted">Camarera</span>}</td>
                    <td>{task.nombre}</td>
                    <td>{task.condition}</td>
                    <td>{task.submission_date}</td>
                    <td>{task.room_nombre}</td>
                    <td>{branches.find(b => b.id === task.room_branch_id)?.nombre || '-'}</td>
                    <td>{task.photo_url ? <img src={task.photo_url} alt="" style={{ width: 50, height: 50 }} /> : "Sin foto"}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-2" onClick={() => editHouseKeeperTask(task.id)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteHouseKeeperTask(task.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default HouseKeeperTask;
