import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateMaintenance = () => {
  const [tasks, setTasks] = useState([]);  // Tareas de mantenimiento
  const [groupedTasks, setGroupedTasks] = useState({});  // Tareas agrupadas por habitación
  const [isRoomSelected, setIsRoomSelected] = useState(false);  // Indica si una habitación ha sido seleccionada
  const [selectedRoomId, setSelectedRoomId] = useState(null);  // ID de la habitación seleccionada
  const navigate = useNavigate();  // Función para redirigir al login si no hay sesión

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  // Fetch todas las tareas de mantenimiento
  const fetchMaintenanceTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás logueado');
        navigate('/loginMaintenance');  // Redirigir si no hay token
        return;
      }

      const decodedToken = jwtDecode(token);  // Decodificamos el token para obtener el maintenance_id
      const maintenanceId = decodedToken.maintenance_id;  // Extraemos el maintenance_id

      const response = await fetch(`${backendUrl}api/maintenancetasks`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pasar el token en el encabezado
        },
      });

      if (!response.ok) {
        alert('Error al obtener las tareas de mantenimiento');
        return;
      }

      const data = await response.json();

      // Filtrar las tareas para que solo se muestren las que corresponden al maintenance logueado
      const filteredTasks = data.filter(task => task.maintenance_id === maintenanceId);

      setTasks(filteredTasks);  // Almacenar las tareas filtradas
      setGroupedTasks(groupTasksByRoom(filteredTasks));  // Agrupar las tareas por habitación
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      alert('Hubo un problema al obtener las tareas de mantenimiento');
    }
  };

  // Agrupar las tareas por habitación
  const groupTasksByRoom = (tasks) => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.room_id]) {
        acc[task.room_id] = [];
      }
      acc[task.room_id].push(task);
      return acc;
    }, {});
  };

  // Cargar las tareas de mantenimiento al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/loginMaintenance');  // Redirigir al login si no hay token
      return;
    }
    fetchMaintenanceTasks();  // Cargar las tareas de mantenimiento
  }, []);

  // Manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginMaintenance');  // Redirigir al login
  };

  // Manejar la selección de una habitación
  const handleRoomClick = (roomId) => {
    setSelectedRoomId(roomId);
    setIsRoomSelected(true);  // Marcar que una habitación ha sido seleccionada
  };

  // Volver a la vista de todas las habitaciones
  const handleBackToRooms = () => {
    setIsRoomSelected(false);  // Volver a la vista de todas las habitaciones
    setSelectedRoomId(null);   // Limpiar la habitación seleccionada
  };

  // Función para cambiar el estado de la tarea
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}api/maintenancetasks/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Enviar el nuevo estado
      });

      if (response.ok) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        // Si la tarea se finaliza, redirigir a la vista de habitaciones
        if (newStatus === 'FINALIZADA') {
          handleBackToRooms();
        }
      } else {
        alert('Error al cambiar el estado de la tarea');
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      alert('Hubo un problema al cambiar el estado de la tarea');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">Tareas de Mantenimiento</h2>

        {/* Mostrar botones para cada habitación */}
        {!isRoomSelected && Object.keys(groupedTasks).length > 0 ? (
          Object.keys(groupedTasks).map((roomId) => {
            const roomTasks = groupedTasks[roomId];
            const roomName = roomTasks[0].room_nombre || `Habitación ${roomId}`;  // Asegurarse de que el nombre exista
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

        {/* Mostrar las tareas de la habitación seleccionada */}
        {isRoomSelected && (
          <div className="mt-4">
            {groupedTasks[selectedRoomId] && groupedTasks[selectedRoomId].map((task) => (
              <div key={task.id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <p><strong>Nombre de la tarea:</strong> {task.nombre}</p>
                  <p><strong>Estado:</strong> {task.status}</p>
                  <p><strong>Foto:</strong></p>
                  {task.photo && <img src={task.photo} alt={task.nombre} style={{ width: '100px', height: '100px' }} />}
                  
                  {/* Botones para cambiar el estado */}
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleStatusChange(task.id, 'PENDIENTE')}
                    disabled={task.status === 'PENDIENTE'}
                  >
                    Pendiente
                  </button>
                  <button
                    className="btn btn-info mr-2"
                    onClick={() => handleStatusChange(task.id, 'EN PROCESO')}
                    disabled={task.status === 'EN PROCESO'}
                  >
                    En Proceso
                  </button>
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => handleStatusChange(task.id, 'FINALIZADA')}
                    disabled={task.status === 'FINALIZADA'}
                  >
                    Finalizada
                  </button>

                  {/* Mostrar checkbox grande y verde si está finalizada */}
                  {task.status === 'FINALIZADA' && <input type="checkbox" checked readOnly style={{ width: '30px', height: '30px', backgroundColor: 'green' }} />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para volver a ver todas las habitaciones */}
        {isRoomSelected && (
          <div className="mt-3">
            <button
              className="btn btn-primary w-100"
              onClick={handleBackToRooms}
            >
              Volver a ver todas las habitaciones
            </button>
          </div>
        )}

        {/* Botón de Cerrar sesión */}
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary mt-3 px-5 py-2"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateMaintenance;
