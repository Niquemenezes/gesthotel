import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import CloudinaryApiHotel from "../component/cloudinaryApiHotel"; 
import PrivateLayout from "./privateLayout";

const Maintenance = () => {
  const [maintenanceSeleccionado, setMaintenanceSeleccionado] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getMaintenances();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { nombre, email, password, photo_url: photoUrl };

    if (maintenanceSeleccionado) {
      actions.putMaintenance(maintenanceSeleccionado.id, data);
    } else {
      actions.postMaintenance(data);
    }

    resetFormulario();
    navigate("/listaMaintenance");
  };

  const eliminar = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este técnico?")) {
      actions.deleteMaintenance(id);
    }
  };

  const resetFormulario = () => {
    setMaintenanceSeleccionado(null);
    setNombre("");
    setEmail("");
    setPassword("");
    setPhotoUrl("");
    setErrorMessage("");
    setMostrarFormulario(false);
  };

  return (
    <PrivateLayout>
      <div className="container">
        <h2 className="text-center my-3">Técnicos de Mantenimiento</h2>

        <div className="d-flex justify-content-center align-items-center mb-4">
          <button
            className="btn"
            style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
            onClick={() => {
              resetFormulario();
              setMostrarFormulario(true);
            }}
          >
            Crear Técnico de Mantenimiento
          </button>
        </div>

        {/* Cabecera de tabla */}
        <div className="row bg-light p-2 fw-bold border-bottom">
          <div className="col">Foto</div>
          <div className="col">Nombre</div>
          <div className="col">Email</div>
          <div className="col text-center">Acciones</div>
        </div>

        {/* Lista de técnicos */}
        {store.maintenances?.map((mantenimiento) => (
          <div key={mantenimiento.id} className="row p-2 border-bottom align-items-center">
            <div className="col">
              {mantenimiento.photo_url ? (
                <img
                  src={mantenimiento.photo_url}
                  alt="foto técnico"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span className="text-muted">Sin foto</span>
              )}
            </div>
            <div className="col">{mantenimiento.nombre}</div>
            <div className="col">{mantenimiento.email}</div>
            <div className="col d-flex justify-content-center">
              <button
                className="btn me-2"
                style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                onClick={() => {
                  setMaintenanceSeleccionado(mantenimiento);
                  setNombre(mantenimiento.nombre);
                  setEmail(mantenimiento.email);
                  setPassword(mantenimiento.password || "");
                  setPhotoUrl(mantenimiento.photo_url || "");
                  setMostrarFormulario(true);
                }}
              >
                Editar
              </button>
              <button
                className="btn"
                style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
                onClick={() => eliminar(mantenimiento.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {/* Formulario de técnico */}
        {mostrarFormulario && (
          <div className="card p-4 mt-5">
            <h3 className="text-center mb-4">
              {maintenanceSeleccionado ? "Editar Técnico" : "Crear Técnico"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-control mb-3"
                placeholder="Nombre"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-3"
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-3"
                placeholder="Contraseña"
                required
              />

              {/* Componente para cargar la imagen */}
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">Foto</label>
                <CloudinaryApiHotel setPhotoUrl={setPhotoUrl} setErrorMessage={setErrorMessage} />
              </div>

              {/* Preview de imagen */}
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="img-thumbnail my-3"
                  style={{ width: "150px" }}
                />
              )}

              <button
                type="submit"
                className="btn w-100"
                style={{ backgroundColor: "#0dcaf0", border: "none", color: "white" }}
              >
                {maintenanceSeleccionado ? "Guardar Cambios" : "Crear Técnico"}
              </button>
            </form>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

export default Maintenance;
