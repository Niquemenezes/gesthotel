import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TaskFilterView = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { view } = location.state || { view: 'all' }; // 'all', 'PENDIENTE', 'FINALIZADA'

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
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      alert('Hubo un problema al obtener las tareas de mantenimiento');
    }
  };

  const filterTasksByCondition = (tasks, condition) => {
    if (condition === 'all') return tasks;
    return tasks.filter(task => task.condition === condition);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/loginMaintenance');
      return;
    }
    fetchMaintenanceTasks();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">
          {view === 'all' ? 'Todas las tareas' : view === 'PENDIENTE' ? 'Tareas Pendientes' : 'Tareas Finalizadas'}
        </h2>

        <div className="mt-4">
          {filterTasksByCondition(tasks, view).map((task) => (
            <div key={task.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <p><strong>Nombre de la tarea:</strong> {task.nombre}</p>
                <p><strong>Condición:</strong> {task.condition}</p>
                <p><strong>Habitación:</strong> {task.room_nombre || `Habitación ${task.room_id}`}</p>
                <p><strong>Foto:</strong></p>
                {task.photo && <img src={task.photo} alt={task.nombre} style={{ width: '100px', height: '100px' }} />}
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center">
          {/* Cambiar la ruta a "/privateMaintenance" */}
          <button className="btn btn-primary mt-3 px-5 py-2" onClick={() => navigate('/privateMaintenance')}>
            Volver a la vista principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterView;