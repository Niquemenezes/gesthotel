import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateMaintenance = () => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
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
      const response = await fetch(`${backendUrl}api/maintenancetasks/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ condition: newCondition }),
      });

      if (response.ok) {
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

        if (newCondition === 'FINALIZADA') {
          handleBackToRooms();
        }
      } else {
        alert('Error al cambiar la condición de la tarea');
      }
    } catch (error) {
      console.error('Error al cambiar la condición:', error);
      alert('Hubo un problema al cambiar la condición de la tarea');
    }
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
                <button className="btn btn-primary mt-3 px-3 py-2" onClick={() => handleRoomClick(roomId)}>
                  <h5>Habitación: {roomName}</h5>
                </button>
              </div>
            );
          })
        ) : null}

        {isRoomSelected && (
          <div className="mt-4">
            {groupedTasks[selectedRoomId] && groupedTasks[selectedRoomId].map((task) => (
              <div key={task.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <p><strong>Nombre de la tarea:</strong> {task.nombre}</p>
                  <p><strong>Condición:</strong> {task.condition}</p>
                  <p><strong>Foto:</strong></p>
                  {task.photo && <img src={task.photo} alt={task.nombre} style={{ width: '100px', height: '100px' }} />}
                  
                  <div className="mt-3 p-3 border rounded d-flex justify-content-around">
                    <button className="btn btn-warning" onClick={() => handleConditionChange(task.id, selectedRoomId, 'PENDIENTE')} disabled={task.condition === 'PENDIENTE'}>
                      Pendiente
                    </button>
                    <button className="btn btn-info" onClick={() => handleConditionChange(task.id, selectedRoomId, 'EN PROCESO')} disabled={task.condition === 'EN PROCESO'}>
                      En Proceso
                    </button>
                    <button className="btn btn-success" onClick={() => handleConditionChange(task.id, selectedRoomId, 'FINALIZADA')} disabled={task.condition === 'FINALIZADA'}>
                      Finalizada
                    </button>
                  </div>

                  {task.condition === 'FINALIZADA' && <input type="checkbox" checked readOnly style={{ width: '30px', height: '30px', backgroundColor: 'green', marginTop: '10px' }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {isRoomSelected && (
          <div className="mt-3">
            <button className="btn btn-primary w-100" onClick={handleBackToRooms}>
              Volver a ver todas las habitaciones
            </button>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mt-3 px-5 py-2" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>

        {/* Botones de filtrado */}
        <div className="card mt-4 p-3">
          <h5 className="text-center">Filtrar tareas</h5>
          <div className="d-flex justify-content-around">
            <button className="btn btn-primary" onClick={() => navigate('/task-filter', { state: { view: 'all' } })}>
              Todas
            </button>
            <button className="btn btn-warning" onClick={() => navigate('/task-filter', { state: { view: 'PENDIENTE' } })}>
              Pendientes
            </button>
            <button className="btn btn-success" onClick={() => navigate('/task-filter', { state: { view: 'FINALIZADA' } })}>
              Finalizadas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateMaintenance;
