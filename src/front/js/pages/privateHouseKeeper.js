import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CloudinaryApiHotel from '../component/cloudinaryApiHotel'; // Asegúrate de tener el componente correcto importado

const PrivateHouseKeeper = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [nombre, setNombre] = useState('');
  const [housekeeperId, setHousekeeperId] = useState(null);
  const [taskPhotos, setTaskPhotos] = useState({}); // Estado para manejar las fotos individuales de cada tarea
  const [maintenancePhoto, setMaintenancePhoto] = useState(''); // Foto para la tarea de mantenimiento
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
    if (housekeeperId === null) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/housekeeper_tasks`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      const filteredTasks = data.filter(task => task.id_housekeeper === housekeeperId && task.condition === 'Pendiente'); // Filtramos las tareas pendientes
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
      nombre: nombre || undefined,
      room_id: selectedRoomId,
      housekeeper_id: housekeeperId
    };

    try {
      const response = await fetch(`${backendUrl}api/maintenancetasks`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Tarea de mantenimiento creada con éxito');
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error al crear la tarea de mantenimiento:', errorData.message);
        alert('Error al crear la tarea de mantenimiento: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error al crear la tarea de mantenimiento:', error);
      alert('Hubo un problema al enviar la solicitud. Por favor, inténtalo de nuevo.');
    }
  };

  const resetForm = () => {
    setNombre('');
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.id_room]) {
      acc[task.id_room] = [];
    }
    acc[task.id_room].push(task);
    return acc;
  }, {});

  // Función para manejar la carga de fotos para las tareas de Housekeeper
  const handlePhotoChange = (taskId, photoUrl) => {
    setTaskPhotos(prevState => ({
      ...prevState,
      [taskId]: photoUrl, // Guardamos la URL de la foto para la tarea específica
    }));
  };

  // Función para manejar la carga de fotos para la tarea de mantenimiento
  const handleMaintenancePhotoChange = (photoUrl) => {
    console.log('URL de la foto de mantenimiento:', photoUrl); // Verifica la URL de la foto
    setMaintenancePhoto(photoUrl); // Guardamos la URL de la foto para la tarea de mantenimiento
  };

  // Función para actualizar el estado de una tarea de housekeeper
  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTask = tasks.find(task => task.id === taskId);
    updatedTask.condition = newStatus;

    try {
      const response = await fetch(`${backendUrl}api/housekeeper_task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ condition: newStatus }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Si el estado es "Completada", filtramos la tarea
        if (newStatus === 'Completada') {
          setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } else {
          // Si no está "Completada", solo actualizamos la tarea
          setTasks(prevTasks =>
            prevTasks.map(task => task.id === taskId ? updatedData : task)
          );
        }
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

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4">Tareas de Housekeeper</h2>
        {!isRoomSelected && Object.keys(groupedTasks).length > 0 ? (
          Object.keys(groupedTasks).map((roomId) => {
            const roomTasks = groupedTasks[roomId];
            return (
              <div key={roomId} className="mb-3">
                <button
                  className="btn btn-primary mt-3 px-3 py-2"
                  onClick={() => handleRoomClick(roomId)}
                >
                  <h5>Habitación: {roomTasks[0].room_nombre}</h5>
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
                  <p><strong>Tarea asignada:</strong> {task.nombre}</p>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <p className="mb-0 ms-2"><strong>Estado:</strong> {task.condition}</p>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={task.condition === 'Completada'} // Marcar el checkbox si la tarea está completada
                        onChange={() => handleStatusChange(task.id, task.condition === 'Completada' ? 'Pendiente' : 'Completada')} // Alternar entre 'Completada' y 'Pendiente'
                      />
                      <label className="form-check-label" htmlFor={`task-${task.id}`}>
                        {task.condition === 'Completada' ? 'Marcar como Pendiente' : 'Marcar como Completada'}
                      </label>
                    </div>
                  </div>

                  <p><strong>Fecha de Asignación:</strong> {task.assignment_date}</p>
                  <p><strong>Fecha de Entrega:</strong> {task.submission_date}</p>

                  {/* Foto de la tarea */}
                  <strong>Foto: </strong>
                  <div className="form-group mb-3">
                    <CloudinaryApiHotel
                      taskId={task.id}  // Pasamos el ID de la tarea
                      setPhotoUrl={handlePhotoChange}
                      setErrorMessage={() => { }}
                    />
                    {taskPhotos[task.id] && (
                      <img
                        src={taskPhotos[task.id]}
                        alt="Vista previa de la foto"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Tarea de Mantenimiento */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h5 className="card-title">Tarea de Mantenimiento</h5>
                <form>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingresa la tarea de mantenimiento..."
                    />
                  </div>

                  {/* <div className="form-group mb-3">
                    <strong>Foto: </strong>
                    <CloudinaryApiHotel
                      taskId="maintenance"
                      setPhotoUrl={handleMaintenancePhotoChange}
                      setErrorMessage={() => { }}
                    />
                    {maintenancePhoto && (
                      <img
                        src={maintenancePhoto}
                        alt="Vista previa de la foto"
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", marginTop: "10px" }}
                      />
                    )}
                  </div> */}

                  <button
                    type="button"
                    className="btn btn-block" style={{ backgroundColor: "#ac85eb", borderColor: "#B7A7D1" }}
                    onClick={createMaintenanceTask}
                  >
                    Crear Tarea
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-3">
              <button
                className="btn  w-100" style={{ backgroundColor: "#ac85eb", borderColor: "#B7A7D1" }}
                onClick={handleBackToRooms}
              >
                Volver a ver todas las habitaciones
              </button>
            </div>
          </div>
        )}
        <div className="d-flex justify-content-center">
          <button
            className="btn mt-3 px-5 py-2" style={{ backgroundColor: "#ac85eb", borderColor: "#B7A7D1" }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateHouseKeeper;
