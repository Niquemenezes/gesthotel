import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faBroom, faTools } from "@fortawesome/free-solid-svg-icons";
import equipo from "../../img/equipo.png";
import camarera from "../../img/camarera.jpg";
import mantenimiento from "../../img/mantenimiento.jpg";
import gobernanta from "../../img/gobernanta.jpg";
import recepcion from "../../img/recepcion.jpg";
import jefemantenimiento from "../../img/jefemantenimiento.jpg";
import { useLocation } from "react-router-dom";
import "../../styles/authLayout.css";


import "../../styles/authLayout.css";

// Configuración visual por rol
const roleConfig = {
  signup: {
    icon: faHotel,
    title: "Registro de Hotel",
    subtitle: "Crea una nueva cuenta para gestionar tu propiedad",
    bgColor: "#0dcaf0",
    image: equipo
  },
  hotel: {
    icon: faHotel,
    title: "Acceso Hotel",
    subtitle: "Ingresa con los datos de tu hotel",
    bgColor: "#0dcaf0",
    image: equipo
  },
  administrador: {
    icon: faHotel,
    title: "Acceso Administrador",
    subtitle: "Gestiona hoteles, usuarios y tareas globales",
    bgColor: "#0dcaf0",
    image: equipo
  },
  gobernanta: {
    icon: faBroom,
    title: "Acceso Gobernanta",
    subtitle: "Gestiona el personal de limpieza",
    bgColor: "#0dcaf0",
    image: gobernanta
  },
  "camarera de piso": {
    icon: faBroom,
    title: "Acceso Camarera de Piso",
    subtitle: "Consulta y completa tus tareas asignadas",
    bgColor: "#0dcaf0",
    image: camarera
  },
  mantenimiento: {
    icon: faTools,
    title: "Acceso Mantenimiento",
    subtitle: "Realiza el seguimiento de las tareas técnicas",
    bgColor: "#0dcaf0",
    image: mantenimiento
  },
  "jefe de mantenimiento": {
    icon: faTools,
    title: "Acceso Jefe de Mantenimiento",
    subtitle: "Coordina al equipo de mantenimiento",
    bgColor: "#0dcaf0",
    image: jefemantenimiento
  },
  recepcion: {
    icon: faHotel,
    title: "Acceso Recepción",
    subtitle: "Gestión de entradas, salidas y habitaciones",
    bgColor: "#0dcaf0",
    image: recepcion
  }
};

const AuthLayout = ({ role, children }) => {
  const location = useLocation();

  const currentRole =
    role ||
    (location.pathname === "/signup"
      ? "signup"
      : "hotel"); // fallback

  const config = roleConfig[currentRole];

  if (!config) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">Rol no válido: {currentRole}</h2>
        <p>Verifica el nombre del rol o corrige el código.</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-section">
        <div className="auth-header">
          <FontAwesomeIcon icon={config.icon} className="auth-icon" style={{ color: config.bgColor }} />
          <h2 style={{ color: config.bgColor }}>{config.title}</h2>
          <p className="text-muted">{config.subtitle}</p>
        </div>
        {children}
      </div>
      <div className="auth-image-section">
        <img
          src={config.image}
          alt={`Imagen de ${currentRole}`}
          className="auth-image"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
