import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faBroom,
  faTools,
  faRightFromBracket,
  faHouse,
  faBars,
  faUserShield,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import DarkModeToggle from "./dark";
import "../../styles/navbar.css";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    actions.logout();
    navigate("/loginHotel");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const rol = store.user?.rol;

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#0dcaf0" }}>
      <div className="container-fluid">
        <span className="navbar-brand fw-bold text-white">GestHotel</span>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={faBars} style={{ color: "white" }} />
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-end align-items-lg-center gap-2 mt-3 mt-lg-0">
            <DarkModeToggle />

            <Link
              className="btn btn-outline-light btn-sm d-flex align-items-center"
              to="/"
              onClick={() => setIsOpen(false)}
            >
              <FontAwesomeIcon icon={faHouse} className="me-1" />
              Inicio
            </Link>

            {/* Opciones visibles solo si el usuario está logueado */}
            {store.token && rol && (
              <>
                {rol === "admin" || rol === "hotel" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/admin"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="me-1" />
                    Admin
                  </Link>
                ) : rol === "gobernanta" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/gobernanta"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="me-1" />
                    Gobernanta
                  </Link>
                ) : rol === "camarera de piso" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/camarera"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faBroom} className="me-1" />
                    Camarera
                  </Link>
                ) : rol === "recepcion" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/recepcion"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faHotel} className="me-1" />
                    Recepción
                  </Link>
                ) : rol === "mantenimiento" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/mantenimiento"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTools} className="me-1" />
                    Técnico
                  </Link>
                ) : rol === "jefe de mantenimiento" ? (
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    to="/private/jefe-mantenimiento"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faTools} className="me-1" />
                    Jefe Mantenimiento
                  </Link>
                ) : null}
              </>
            )}

            {/* Si no está logueado, muestra accesos a login */}
            {!store.token && (
              <Link
                className="btn btn-outline-light btn-sm d-flex align-items-center"
                to="/loginHotel"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faHotel} className="me-1" />
                Iniciar Sesión
              </Link>
            )}

            {/* Botón logout */}
            {store.token && (
              <button
                className="btn btn-light btn-sm d-flex align-items-center"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
