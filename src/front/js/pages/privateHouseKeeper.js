// Código completo con mejoras visuales y filtros de tareas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloudinaryApiHotel from '../component/cloudinaryApiHotel';
import "../../styles/privatehousekeepers.css";

const PrivateHouseKeeper = () => {
  const [tasks, setTasks] = useState([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [nombre, setNombre] = useState('');
  const [housekeeperId, setHousekeeperId] = useState(null);
  const [maintenancePhoto, setMaintenancePhoto] = useState('');
  const [maintenanceCondition, setMaintenanceCondition] = useState('PENDIENTE');
  const [showMaintenanceTasks, setShowMaintenanceTasks] = useState(false);
  const [photo, setPhoto] = useState('');
  const [taskFilter, setTaskFilter] = useState('TODAS');

  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const getHousekeeperIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setHousekeeperId(decoded.housekeeper_id);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        alert('Hubo un error al obtener el ID del housekeeper');
      }
    } else {
      navigate('/loginHouseKeeper');
    }
  };

  useEffect(() => {
    getHousekeeperIdFromToken();
  }, []);

  const handleFetchTasks = async () => {
    if (housekeeperId === null) return;
    try {
      const response = await fetch(`${backendUrl}api/housekeeper_tasks`);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      const data = await response.json();
      const filteredTasks = data.filter(task => task.id_housekeeper === housekeeperId);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      alert('Error al obtener las tareas, por favor intente más tarde.');
    }
  };

  useEffect(() => {
    if (housekeeperId !== null) {
      handleFetchTasks();
    }
  }, [housekeeperId]);

  const handleFetchMaintenanceTasks = async () => {
    const token = localStorage.getItem('token');
    let housekeeperId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        housekeeperId = decoded.housekeeper_id;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        alert('Hubo un error al obtener el ID del housekeeper');
        return;
      }
    }
    if (!housekeeperId) return;

    try {
      const response = await fetch(
        `${backendUrl}api/maintenancetasks/filter?housekeeper_id=${housekeeperId}&room_id=${selectedRoomId}`
      );
      if (!response.ok) throw new Error('Error al obtener las tareas de mantenimiento');
      const data = await response.json();
      const filtered = data.filter(task => task.condition === 'PENDIENTE');
      setMaintenanceTasks(filtered);
    } catch (error) {
      console.error('Error al obtener las tareas de mantenimiento:', error);
      alert('Hubo un error al obtener las tareas de mantenimiento');
    }
  };

  useEffect(() => {
    if (housekeeperId && selectedRoomId) {
      handleFetchMaintenanceTasks();
    }
  }, [housekeeperId, selectedRoomId]);

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsRoomSelected(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginHouseKeeper');
  };

  const handleBackToRooms = () => {
    setIsRoomSelected(false);
    setSelectedRoomId(null);
  };

  const createMaintenanceTask = async () => {
    if (!nombre.trim()) {
      alert("Por favor, introduce el nombre de la tarea.");
      return;
    }
    if (!maintenancePhoto) {
      alert("Por favor, sube una imagen de la incidencia.");
      return;
    }

    const token = localStorage.getItem('token');
    let housekeeperId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        housekeeperId = decoded.housekeeper_id;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        alert('Hubo un error al obtener el ID del housekeeper');
        return;
      }
    }

    const taskData = {
      nombre,
      room_id: selectedRoomId,
      housekeeper_id: housekeeperId,
      condition: maintenanceCondition,
      photo_url: maintenancePhoto,
      maintenance_id: null,
      category_id: null,
    };

    try {
      const response = await fetch(`${backendUrl}api/maintenancetasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (response.ok) {
        const data = await response.json();
        alert('Tarea de mantenimiento creada con éxito');
        setMaintenanceTasks(prev => [...prev, data]);
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error al crear la tarea de mantenimiento:', errorData.message);
        alert('Error al crear la tarea de mantenimiento: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error al crear la tarea de mantenimiento:', error);
      alert('Hubo un problema al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  const resetForm = () => {
    setNombre('');
    setMaintenanceCondition('PENDIENTE');
    setMaintenancePhoto('');
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id_room]) acc[task.id_room] = [];
    acc[task.id_room].push(task);
    return acc;
  }, {});

  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    updatedTask.condition = newStatus;
    try {
      const response = await fetch(`${backendUrl}api/housekeeper_task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: newStatus }),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setTasks(prev =>
          prev.map(task => task.id === taskId ? { ...task, condition: newStatus } : task)
        );

        alert('Estado de la tarea actualizado con éxito');
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar el estado:', errorData.message);
        alert('Error al actualizar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('Hubo un problema al actualizar el estado de la tarea.');
    }
  };

  const toggleMaintenanceTasks = () => {
    setShowMaintenanceTasks(prev => !prev);
  };

  const getFilteredTasks = () => {
    if (!selectedRoomId || !groupedTasks[selectedRoomId]) return [];
    return groupedTasks[selectedRoomId].filter(task => {
      if (taskFilter === 'TODAS') return true;
      return task.condition === taskFilter;
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '900px' }}>
        <h2 className="text-center mb-4">Tareas de Camarera</h2>

        {!isRoomSelected && Object.keys(groupedTasks).length > 0 && (
          <div className="row">
            {Object.keys(groupedTasks).map(roomId => {
              const tareas = groupedTasks[roomId];
              const todasFinalizadas = tareas.every(task => task.condition === 'FINALIZADA');
              const hayPendientes = tareas.some(task => task.condition === 'PENDIENTE');

              let iconEstado = '';
              const iconRoom = <i className="fas fa-bed me-2"></i>; // Ícono Font Awesome

              if (todasFinalizadas) {
                iconEstado = '✅';
              } else if (hayPendientes) {
                iconEstado = '🕒';
              } else {
                iconEstado = '❔';
              }

              return (
                <div key={roomId} className="col-md-6">
                  <button
                    className="btn custom-room-button text-start mb-3 w-100 py-2 fw-semibold"
                    onClick={() => handleRoomClick(roomId)}
                  >
                    {iconRoom} {iconEstado} Habitación: {tareas[0].room_nombre}
                  </button>
                </div>
              );
            })}
          </div>
        )}



        {isRoomSelected && (
          <div className="mt-4">
            <div className="d-flex justify-content-center mb-3">
              <button className={`btn mx-2 ${taskFilter === 'TODAS' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setTaskFilter('TODAS')}>
                Todas
              </button>
              <button className={`btn mx-2 ${taskFilter === 'PENDIENTE' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setTaskFilter('PENDIENTE')}>
                Pendientes
              </button>
              <button className={`btn mx-2 ${taskFilter === 'FINALIZADA' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setTaskFilter('FINALIZADA')}>
                Finalizadas
              </button>
            </div>

            {getFilteredTasks().map(task => (
              <div key={task.id} className="card mb-3 shadow-sm rounded-3">
                <div className="card-body">
                  <p><strong>Tarea asignada:</strong> {task.nombre}</p>
                  <div className="d-flex justify-content-between mb-3">
                    <div><p className="mb-0 ms-2"><strong>Estado:</strong> {task.condition}</p></div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={task.condition === 'FINALIZADA'}
                        onChange={() => handleStatusChange(task.id, task.condition === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA')}
                      />
                      <label className="form-check-label">
                        {task.condition === 'FINALIZADA' ? 'Marcar como PENDIENTE' : 'Marcar como FINALIZADA'}
                      </label>
                    </div>
                  </div>
                  <p><strong>Fecha de Asignación:</strong> {task.assignment_date}</p>
                  <p><strong>Fecha de Entrega:</strong> {task.submission_date}</p>
                  <strong>Foto: </strong>
                  <div className="form-group mb-3">
                    <CloudinaryApiHotel setPhotoUrl={setPhoto} setErrorMessage={() => { }} />
                    {photo && <img src={photo} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 10 }} />}
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <button className="btn custom-room-button" onClick={toggleMaintenanceTasks}>
                {showMaintenanceTasks ? 'Ocultar tareas de mantenimiento' : 'Mostrar tareas de mantenimiento'}
              </button>
            </div>

            {showMaintenanceTasks && (
              <div className="card shadow-lg mt-4">
                <div className="card-body">
                  <h5 className="card-title">Tarea de Mantenimiento</h5>
                  <form>
                    <div className="form-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa la tarea de mantenimiento..."
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      />
                    </div>
                    <strong>Foto: </strong>
                    <div className="form-group mb-3">
                      <CloudinaryApiHotel setPhotoUrl={setMaintenancePhoto} setErrorMessage={() => { }} />
                      {maintenancePhoto && <img src={maintenancePhoto} alt="Preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 10 }} />}
                    </div>
                    <button
                      type="button"
                      className="btn btn-block"
                      style={{ backgroundColor: "#0dcaf0" }}
                      onClick={createMaintenanceTask}
                    >
                      Crear Tarea
                    </button>

                    <div className="mt-4">
                      <h4 className="mb-3">Listado de Tareas de Mantenimiento</h4>
                      {maintenanceTasks.length > 0 ? (
                        <div className="list-group">
                          {maintenanceTasks.map(task => (
                            <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>{task.nombre}</span>
                              <span className={`badge ${task.condition === 'PENDIENTE' ? 'bg-primary' : 'bg-secondary'} ms-2`}>
                                {task.condition}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-info" role="alert">
                          No hay tareas de mantenimiento disponibles.
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            <button
              className="btn custom-room-button w-100 mt-3 fw-semibold py-2"
              onClick={handleBackToRooms}
            >
              🔙 Volver a todas las habitaciones
            </button>

          </div>
          
        )}

      <div className="d-flex justify-content-center">
        <button className="btn mt-3 px-5 py-2" style={{ backgroundColor: "#0dcaf0" }} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> Cerrar sesión

          Cerrar sesión
        </button>
      </div>
    </div>
    </div >
  );
};

export default PrivateHouseKeeper;
