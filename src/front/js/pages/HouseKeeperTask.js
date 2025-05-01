import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import PrivateLayout from "../component/privateLayout";
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faSave, faTimes, faPlaneDeparture, faUser, faCircleInfo, faClock, faSpinner, faCheckCircle, faBed } from "@fortawesome/free-solid-svg-icons";

const HouseKeeperTask = () => {
  const { store, actions } = useContext(Context);
  const { housekeepers = [], rooms = [], housekeeperTasks = [], branches = [] } = store;
  const [condition, setCondition] = useState('PENDIENTE');
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [submissionDate, setSubmissionDate] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [idHousekeeper, setIdHousekeeper] = useState('');
  const [notaHousekeeper, setNotaHousekeeper] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [esZonaComun, setEsZonaComun] = useState(false);

  useEffect(() => {
    actions.getHousekeepers();
    actions.getBranches();
    actions.getRooms();
    actions.getHouseKeeperTasks();
  }, []);

  const filteredRooms = idHousekeeper
    ? rooms.filter(room => {
      const hk = housekeepers.find(h => h.id == idHousekeeper);
      const yaAsignada = housekeeperTasks.some(t => t.id_room === room.id && t.id_housekeeper !== parseInt(idHousekeeper));
      return hk ? room.branch_id === hk.id_branche && !yaAsignada : false;
    })
    : [];

  const getTaskConditionForRoom = (roomId) => {
    const task = housekeeperTasks.find(t =>
      t.id_housekeeper === parseInt(idHousekeeper) && t.id_room === roomId
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

  const getTaskStyle = (tarea) => {
    const t = tarea.toUpperCase();
    if (t.includes("SALIDA")) return { className: "text-danger", icon: faPlaneDeparture };
    if (t.includes("CLIENTE")) return { className: "text-warning", icon: faUser };
    if (t.includes("CAMBIO DE SÁBANAS")) return { className: "text-primary", icon: faBed };
    return { className: "text-success", icon: faCircleInfo };
  };

  const getConditionStyle = (condition) => {
    switch (condition) {
      case "PENDIENTE":
        return { className: "badge bg-danger d-inline-flex align-items-center gap-1", icon: faClock };
      case "EN PROCESO":
        return { className: "badge bg-warning text-dark d-inline-flex align-items-center gap-1", icon: faSpinner };
      case "FINALIZADA":
        return { className: "badge bg-success d-inline-flex align-items-center gap-1", icon: faCheckCircle };
      default:
        return { className: "badge bg-secondary", icon: faCircleInfo };
    }
  };

  const toggleRoomSelection = (roomId) => {
    if (editingTaskId) {
      setSelectedRooms([roomId]);
    } else {
      const existing = getTaskConditionForRoom(roomId);
      if (!existing) {
        setSelectedRooms(prev =>
          prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!idHousekeeper || !nombre || (!esZonaComun && selectedRooms.length === 0) || !assignmentDate || !submissionDate) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    if (editingTaskId) {
      const updatedTask = {
        nombre,
        photo_url: photo,
        condition,
        assignment_date: assignmentDate,
        submission_date: submissionDate,
        id_room: esZonaComun ? null : selectedRooms[0],
        id_housekeeper: idHousekeeper,
        nota_housekeeper: notaHousekeeper
      };
      await actions.updateHouseKeeperTask(editingTaskId, updatedTask);
    } else {
      const data = esZonaComun
        ? [{
          nombre,
          photo_url: photo,
          condition,
          assignment_date: assignmentDate,
          submission_date: submissionDate,
          id_room: null,
          id_housekeeper: idHousekeeper,
          nota_housekeeper: notaHousekeeper
        }]
        : selectedRooms.map(roomId => ({
          nombre,
          photo_url: photo,
          condition,
          assignment_date: assignmentDate,
          submission_date: submissionDate,
          id_room: roomId,
          id_housekeeper: idHousekeeper,
          nota_housekeeper: notaHousekeeper
        }));

      for (const tarea of data) {
        await actions.createHouseKeeperTask(tarea);
      }
    }

    await actions.getHouseKeeperTasks();
    resetForm();
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setNombre(task.nombre);
    setPhoto(task.photo_url || '');
    setCondition(task.condition);
    setAssignmentDate(task.assignment_date);
    setSubmissionDate(task.submission_date);
    setIdHousekeeper(task.id_housekeeper.toString());
    setSelectedRooms(task.id_room ? [task.id_room] : []);
    setEsZonaComun(task.id_room === null);
    setNotaHousekeeper(task.nota_housekeeper || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás segura/o de eliminar esta tarea?")) {
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
    setSelectedRooms([]);
    setIdHousekeeper('');
    setEditingTaskId(null);
    setEsZonaComun(false);
    setNotaHousekeeper('');
  };

  // Calcular el tiempo transcurrido entre la hora de inicio y la hora de finalización
  const calculateTimeSpent = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";

    const start = new Date(startTime);
    const end = new Date(endTime);

    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };



  return (
    <PrivateLayout>
      <div className="container">
        <h1 className="my-4 text-center">Asignar Tareas de Limpieza</h1>
        <div className="row">
          <div className="col-12 col-md-3 mb-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center mb-3">{editingTaskId ? "Editar Tarea" : "Nueva Tarea"}</h5>

              {/* Camarera */}
              <div className="form-group mb-2">
                <label>Camarera</label>
                <select className="form-control" value={idHousekeeper} onChange={e => setIdHousekeeper(e.target.value)}>
                  <option value="">Selecciona una camarera</option>
                  {housekeepers.map(h => (<option key={h.id} value={h.id}>{h.nombre}</option>))}
                </select>
              </div>

              {/* Tarea fuera de habitación */}
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" checked={esZonaComun} onChange={() => setEsZonaComun(!esZonaComun)} id="zonaComunCheck" />
                <label className="form-check-label" htmlFor="zonaComunCheck">Tarea fuera de una habitación</label>
              </div>

              {/* Si no es zona común, mostramos las habitaciones */}
              {!esZonaComun ? (
                <>
                  {/* Habitaciones */}
                  <div className="form-group mb-2">
                    <label>Habitaciones</label>
                    <div className="d-flex flex-wrap gap-2">
                      {filteredRooms.map(room => {
                        const condition = getTaskConditionForRoom(room.id);
                        const selected = selectedRooms.includes(room.id);
                        const task = housekeeperTasks.find(t => t.id_housekeeper === parseInt(idHousekeeper) && t.id_room === room.id);
                        const tarea = task?.nombre?.toUpperCase() || "";
                        let icon = faCircleInfo;
                        let textClass = "text-success";
                        if (tarea.includes("SALIDA")) { icon = faPlaneDeparture; textClass = "text-danger"; }
                        else if (tarea.includes("CLIENTE")) { icon = faUser; textClass = "text-warning"; }
                        const colorClass = condition ? getColorClassForCondition(condition) : selected ? 'btn-primary' : 'btn-outline-secondary';
                        return (
                          <button
                            key={room.id}
                            type="button"
                            className={`btn btn-sm ${colorClass} d-flex align-items-center gap-2`}
                            onClick={() => toggleRoomSelection(room.id)}
                            disabled={!!condition && (!editingTaskId || selectedRooms[0] !== room.id)}
                            title={condition ? `Ya tiene tarea (${condition})` : 'Seleccionar'}
                          >
                            <FontAwesomeIcon icon={icon} className={textClass} />
                            {room.nombre}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tipo de Tarea */}
                  <div className="form-group mb-2">
                    <label>Tipo de Tarea</label>
                    <select className="form-control" value={nombre} onChange={e => setNombre(e.target.value)}>
                      <option value="">Selecciona un tipo de tarea</option>
                      <option value="Clientes">Clientes</option>
                      <option value="Salida">Salida</option>
                      <option value="Cambio de Sábanas">Cambio de Sábanas</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="form-group mb-2">
                  <label>Tipo de Tarea</label>
                  <input
                    className="form-control"
                    placeholder="Ej: Pasillo, zonas comunes..."
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                  />
                </div>
              )}

              {/* Foto */}
              <div className="form-group mb-2">
                <label>Foto</label>
                <CloudinaryApiHotel setPhotoUrl={setPhoto} setErrorMessage={setErrorMessage} />
                {photo && <img src={photo} alt="Preview" style={{ width: 60, marginTop: 10 }} />}
              </div>

              {/* Fecha de entrega */}
              <div className="form-group mb-2">
                <label>Entrega</label>
                <input type="date" className="form-control" value={submissionDate} onChange={e => setSubmissionDate(e.target.value)} />
              </div>

              {/* Observaciones */}
              <div className="form-group mb-2">
                <label>Observaciones</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={notaHousekeeper}
                  onChange={(e) => setNotaHousekeeper(e.target.value)}
                ></textarea>
              </div>

              {/* Hora de Inicio */}
              {editingTaskId && (
                <div className="form-group mb-2">
                  <label>Hora de Inicio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={housekeeperTasks.find(task => task.id === editingTaskId)?.start_time || 'No iniciada'}
                    readOnly
                  />
                </div>
              )}

              {/* Hora de Finalización */}
              {editingTaskId && (
                <div className="form-group mb-2">
                  <label>Hora de Finalización</label>
                  <input
                    type="text"
                    className="form-control"
                    value={housekeeperTasks.find(task => task.id === editingTaskId)?.end_time || 'No finalizada'}
                    readOnly
                  />
                </div>
              )}

              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={handleSubmit}>
                  <FontAwesomeIcon icon={faSave} className="me-1" />
                  {editingTaskId ? "Actualizar" : "Crear"}
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  <FontAwesomeIcon icon={faTimes} className="me-1" />Cancelar
                </button>
              </div>

              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </div>
          </div>

          <div className="col-12 col-md-9">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Camarera</th>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Entrega</th>
                  <th>Habitación</th>
                  <th>Foto</th>
                  <th>Observaciones</th>
                  <th>Hora de Inicio</th>
                  <th>Hora de Finalización</th>
                  <th>Tiempo Transcurrido</th> {/* Nueva columna */}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {housekeeperTasks.map(task => {
                  const { className, icon } = getTaskStyle(task.nombre);
                  const condStyle = getConditionStyle(task.condition);
                  const startTime = task.start_time || '00:00';
                  const endTime = task.end_time || '00:00';
                  const timeSpent = calculateTimeSpent(startTime, endTime);
                  return (
                    <tr key={task.id}>
                      <td>{housekeepers.find(h => h.id === task.id_housekeeper)?.nombre || 'Camarera'}</td>
                      <td>
                        <span className={`d-inline-flex align-items-center gap-2 ${className}`}>
                          <FontAwesomeIcon icon={icon} />
                        </span>
                      </td>
                      <td>
                        <span className={condStyle.className}>
                          <FontAwesomeIcon icon={condStyle.icon} />
                        </span>
                      </td>
                      <td>{task.submission_date}</td>
                      <td>{task.room_nombre || 'Zona común'}</td>
                      <td>{task.photo_url ? <img src={task.photo_url} alt="" style={{ width: 40, height: 40, borderRadius: 4 }} /> : 'Sin foto'}</td>
                      <td><p>{task.nota_housekeeper || ''}</p></td>
                      <td>{task.start_time ? new Date(task.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</td>
                      <td>{task.end_time ? new Date(task.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "-"}</td>


                      <td>{timeSpent}</td> {/* Mostrar el tiempo transcurrido */}
                      <td>
                        <button className="btn btn-sm btn-info me-1" onClick={() => handleEdit(task)}>
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task.id)}>
                          <FontAwesomeIcon icon={faTrash} />
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

export default HouseKeeperTask;
