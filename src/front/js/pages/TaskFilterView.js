import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TaskFilterView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { view = 'all', tasks = [] } = location.state || {};

  // Cargar fotos persistentes desde localStorage
  const persistentPhotos = JSON.parse(localStorage.getItem('maintenanceTaskPhotos') || '{}');

  const filterTasksByCondition = (tasks, condition) => {
    if (condition === 'all') return tasks;
    return tasks.filter(task => task.condition === condition);
  };

  // Combinar fotos de las tareas con las fotos persistentes
  const enhancedTasks = tasks.map(task => ({
    ...task,
    photo: task.photo_url || persistentPhotos[task.id] || null
  }));

  const filteredTasks = filterTasksByCondition(enhancedTasks, view);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="text-center mb-4 text-primary">
          {view === 'all' ? 'Todas las tareas' : 
           view === 'PENDIENTE' ? 'Tareas Pendientes' : 'Tareas Finalizadas'}
        </h2>

        <div className="mt-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <p><strong>Nombre:</strong> {task.nombre}</p>
                <p><strong>Estado:</strong> 
                  <span className={`badge ${
                    task.condition === 'PENDIENTE' ? 'bg-warning' :
                    task.condition === 'EN PROCESO' ? 'bg-info' : 'bg-success'
                  } ms-2`}>
                    {task.condition}
                  </span>
                </p>
                <p><strong>Habitación:</strong> {task.room_nombre || `Habitación ${task.room_id}`}</p>
                
                {(task.photo || task.photo_url) && (
                  <div className="mt-2">
                    <p><strong>Foto:</strong></p>
                    <img 
                      src={task.photo || task.photo_url} 
                      alt={`Tarea ${task.nombre}`}
                      className="img-thumbnail"
                      style={{ maxWidth: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center">
          <button 
            className="btn btn-primary mt-3 px-5 py-2" 
            onClick={() => navigate('/privateMaintenance')}
          >
            Volver a la vista principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterView;