import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloudinaryApiHotel from "../component/cloudinaryApiHotel";

const PrivateMaintenance = () => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [taskPhotos, setTaskPhotos] = useState({}); // { taskId: photoUrl }
  const [errorMessages, setErrorMessages] = useState({}); // { taskId: errorMessage }
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const fetchMaintenanceTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás logueado');
        navigate('/loginMaintenance');
        return;
      }

      const decodedToken = jwtDecode(token);
      const maintenanceId = decodedToken.maintenance_id;

      const response = await fetch(`${backendUrl}api/maintenancetasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert('Error al obtener las tareas de mantenimiento');
        return;
      }

      const data = await response.json();
      const filteredTasks = data.filter(task => task.maintenance_id === maintenanceId);

      setTasks(filteredTasks);
      setGroupedTasks(groupTasksByRoom(filteredTasks));
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      alert('Hubo un problema al obtener las tareas de mantenimiento');
    }
  };

  const groupTasksByRoom = (tasks) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.room_id]) {
        acc[task.room_id] = [];
      }
      acc[task.room_id].push(task);
      return acc;
    }, {});
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/loginMaintenance');
      return;
    }
    fetchMaintenanceTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginMaintenance');
  };

  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsRoomSelected(true);
  };

  const handleBackToRooms = () => {
    setIsRoomSelected(false);
    setSelectedRoomId(null);
  };

  const handleConditionChange = async (taskId, selectedRoomId, newCondition) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/loginMaintenance');
        return;
      }
  
      // 1. Actualización optimista inmediata en el frontend
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, condition: newCondition } : task
        )
      );
  
      setGroupedTasks(prevGroupedTasks => ({
        ...prevGroupedTasks,
        [selectedRoomId]: prevGroupedTasks[selectedRoomId].map(task =>
          task.id === taskId ? { ...task, condition: newCondition } : task
        ),
      }));
  
      // 2. Petición al backend
      const response = await fetch(`${backendUrl}api/maintenancetasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          condition: newCondition,
          maintenance_id: jwtDecode(token).maintenance_id,
          photo: taskPhotos[taskId] || null // Incluir la foto si existe
        }),
      });
  
      // 3. Si falla la petición, recargamos los datos originales
      if (!response.ok) {
        fetchMaintenanceTasks();
        return;
      }
  
      // 4. Si es FINALIZADA, volver a la vista de habitaciones
      if (newCondition === 'FINALIZADA') {
        setTimeout(handleBackToRooms, 500);
      }
  
    } catch (error) {
      console.error('Error:', error);
      fetchMaintenanceTasks(); // Sincronizar con el estado actual del backend
    }
  };

  const handlePhotoUpload = (taskId, photoUrl) => {
    setTaskPhotos(prev => ({
      ...prev,
      [taskId]: photoUrl
    }));
  };

  const handlePhotoError = (taskId, errorMessage) => {
    setErrorMessages(prev => ({
      ...prev,
      [taskId]: errorMessage
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Tareas de Mantenimiento</h2>

        {!isRoomSelected && Object.keys(groupedTasks).length > 0 ? (
          Object.keys(groupedTasks).map((roomId) => {
            const roomTasks = groupedTasks[roomId];
            const roomName = roomTasks[0].room_nombre || `Habitación ${roomId}`;
            return (
              <div key={roomId} className="mb-3">
                <button 
                  className="btn btn-primary mt-3 px-3 py-2" 
                  onClick={() => handleRoomClick(roomId)}
                >
                  <h5>Habitación: {roomName}</h5>
                </button>
              </div>
            );
          })
        ) : null}

        {isRoomSelected && (
          <>
            <div className="mt-4">
              {groupedTasks[selectedRoomId]?.map((task) => (
                <div key={task.id} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <p><strong>Nombre:</strong> {task.nombre}</p>
                    <p><strong>Estado actual:</strong> 
                      <span className={`badge ${
                        task.condition === 'PENDIENTE' ? 'bg-warning' :
                        task.condition === 'EN PROCESO' ? 'bg-info' : 'bg-success'
                      } ms-2`}>
                        {task.condition}
                      </span>
                    </p>

                    {/* Componente Cloudinary para cada tarea */}
                    <div className="mb-3">
                      <label htmlFor="photo" className="form-label">Foto</label>
                      <CloudinaryApiHotel 
                        setPhotoUrl={(url) => handlePhotoUpload(task.id, url)}
                        setErrorMessage={(msg) => handlePhotoError(task.id, msg)}
                      />
                      {(taskPhotos[task.id] || task.photo) && (
                        <div className="mt-2">
                          <img 
                            src={taskPhotos[task.id] || task.photo} 
                            alt={`Tarea ${task.nombre}`} 
                            className="img-thumbnail"
                            style={{ maxWidth: '200px' }}
                          />
                        </div>
                      )}
                      {errorMessages[task.id] && (
                        <div className="text-danger small mt-1">{errorMessages[task.id]}</div>
                      )}
                    </div>
                    
                    <div className="mt-3 p-3 border rounded d-flex justify-content-around">
                      {['PENDIENTE', 'EN PROCESO', 'FINALIZADA'].map((status) => (
                        <button
                          key={status}
                          className={`btn ${
                            status === 'PENDIENTE' ? 'btn-warning' :
                            status === 'EN PROCESO' ? 'btn-info' : 'btn-success'
                          }`}
                          onClick={() => handleConditionChange(task.id, selectedRoomId, status)}
                          disabled={task.condition === status}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {task.condition === 'FINALIZADA' && (
                      <div className="text-center mt-2">
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                        <span className="ms-2">Tarea completada</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-secondary w-100 mt-3" 
              onClick={handleBackToRooms}
            >
              ← Volver a habitaciones
            </button>
          </>
        )}

        <div className="mt-4 border-top pt-3">
          <button 
            className="btn btn-outline-danger w-100" 
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>

        <div className="card mt-4 p-3">
          <h5 className="text-center">Filtrar tareas</h5>
          <div className="d-flex justify-content-around">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/task-filter', { state: { view: 'all' } })}
            >
              Todas
            </button>
            <button 
              className="btn btn-warning" 
              onClick={() => navigate('/task-filter', { state: { view: 'PENDIENTE' } })}
            >
              Pendientes
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => navigate('/task-filter', { state: { view: 'FINALIZADA' } })}
            >
              Finalizadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateMaintenance;
