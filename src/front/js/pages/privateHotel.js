import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Sidebar from "../component/sidebar";
import "../../styles/dashboard.css";

const PrivateHotel = () => {
  const { store, actions } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState({
    sucursales: 0,
    camareras: 0,
    tecnicos: 0,
    incidencias: 0,
    tareasLimpieza: 0,
    tareasMantenimiento: 0,
    habitaciones: 0
  });

  const nombreHotel = store.hotel?.nombre || "Tu Hotel";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await actions.getHotelDatos();
        setDatos({
          sucursales: data.sucursales || 0,
          camareras: data.camareras || 0,
          tecnicos: data.tecnicos || 0,
          incidencias: data.incidencias || 0,
          tareasLimpieza: data.tareasLimpieza || 0,
          tareasMantenimiento: data.tareasMantenimiento || 0,
          habitaciones: data.habitaciones || 0
        });
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />
        <div className="flex-fill d-flex align-items-center justify-content-center" style={{ 
          marginLeft: collapsed ? "70px" : "250px",
          backgroundColor: "#f5f7fb"
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar con el color de Hyper */}
      <Sidebar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />

      {/* Contenido principal */}
      <div className="flex-fill" style={{ marginLeft: collapsed ? "70px" : "250px", transition: "margin-left 0.3s ease", backgroundColor: "#f5f7fb", height: "100vh", overflow: "hidden" }}>
        {/* Header */}
        <div className="p-4 border-bottom bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Dashboard</h4>
            <div className="d-flex align-items-center">
              <span className="me-3">Bienvenido, {nombreHotel}</span>
              <div className="avatar-sm">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-16">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del dashboard */}
        <div className="p-4" style={{ height: "calc(100vh - 72px)", overflow: "auto" }}>
          {/* Estadísticas rápidas */}
          <div className="row mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Habitaciones</h6>
                      <h3 className="mb-0">{datos.habitaciones}</h3>
                    </div>
                    <i className="fas fa-bed fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Camareras</h6>
                      <h3 className="mb-0">{datos.camareras}</h3>
                    </div>
                    <i className="fas fa-user-nurse fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Técnicos</h6>
                      <h3 className="mb-0">{datos.tecnicos}</h3>
                    </div>
                    <i className="fas fa-tools fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-white-50 mb-2">Incidencias</h6>
                      <h3 className="mb-0">{datos.incidencias}</h3>
                    </div>
                    <i className="fas fa-exclamation-triangle fa-2x opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección principal */}
          <div className="row">
            {/* Personal */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Equipo de Trabajo</h4>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body text-center">
                          <i className="fas fa-user-nurse text-primary mb-3" style={{ fontSize: "2rem" }}></i>
                          <h5>Camareras</h5>
                          <h2>{datos.camareras}</h2>
                          <Link to="/houseKeeper" className="btn btn-sm btn-primary mt-2">
                            Gestionar
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body text-center">
                          <i className="fas fa-tools text-info mb-3" style={{ fontSize: "2rem" }}></i>
                          <h5>Técnicos</h5>
                          <h2>{datos.tecnicos}</h2>
                          <Link to="/listaMaintenance" className="btn btn-sm btn-info mt-2">
                            Gestionar
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tareas */}
            <div className="col-xl-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Tareas Pendientes</h4>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body text-center">
                          <i className="fas fa-broom text-teal mb-3" style={{ fontSize: "2rem" }}></i>
                          <h5>Limpieza</h5>
                          <h2>{datos.tareasLimpieza}</h2>
                          <Link to="/HouseKeeperTask" className="btn btn-sm btn-teal mt-2">
                            Ver tareas
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border">
                        <div className="card-body text-center">
                          <i className="fas fa-wrench text-orange mb-3" style={{ fontSize: "2rem" }}></i>
                          <h5>Mantenimiento</h5>
                          <h2>{datos.tareasMantenimiento}</h2>
                          <Link to="/maintenanceTask" className="btn btn-sm btn-orange mt-2">
                            Ver tareas
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Última sección */}
          <div className="row mt-4">
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4">Resumen General</h4>
                  
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="p-3 border rounded">
                        <h6>Sucursales</h6>
                        <h3>{datos.sucursales}</h3>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded">
                        <h6>Habitaciones</h6>
                        <h3>{datos.habitaciones}</h3>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded">
                        <h6>Personal</h6>
                        <h3>{datos.camareras + datos.tecnicos}</h3>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="p-3 border rounded">
                        <h6>Tareas</h6>
                        <h3>{datos.tareasLimpieza + datos.tareasMantenimiento}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateHotel;