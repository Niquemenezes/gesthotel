// src/component/AuthLayout.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faBroom, faTools } from "@fortawesome/free-solid-svg-icons";
import equipo from "../../img/equipo.png";
import camarera from "../../img/camarera.jpg";
import mantenimiento from "../../img/mantenimiento.jpg";
import "../../styles/authLayout.css";

const roleConfig = {
  hotel: {
    icon: faHotel,
    title: "Inicia sesión",
    subtitle: "Ingresa con los datos de tu hotel",
    bgColor: "#6b72dd",
    image: equipo
  },
  housekeeper: {
    icon: faBroom,
    title: "Acceso Housekeeper",
    subtitle: "Ingresa tus credenciales de limpieza",
    bgColor: "#27ae60",
    image: camarera
  },
  maintenance: {
    icon: faTools,
    title: "Acceso Mantenimiento",
    subtitle: "Ingresa tus credenciales técnicas",
    bgColor: "#e67e22",
    image: mantenimiento
  }
};

const AuthLayout = ({ role = "hotel", children }) => {
  const config = roleConfig[role];

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
          alt={`Imagen de ${role}`}
          className="auth-image"
        />
      </div>
    </div>
  );
};

export default AuthLayout;