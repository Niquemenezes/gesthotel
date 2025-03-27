import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faBroom,
  faTools,
  faRightFromBracket,
  faHouse
} from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/loginHotel");
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: "#0dcaf0" }}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Logo / Nombre */}
        <Link className="navbar-brand text-white fs-4 fw-bold d-flex align-items-center" to="/">
          <FontAwesomeIcon icon={faHotel} className="me-2" />
          APIHOTEL
        </Link>

        {/* Botones al lado derecho */}
        <div className="d-flex align-items-center gap-2">
          {/* Volver a Home */}
          <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/">
            <FontAwesomeIcon icon={faHouse} className="me-1" />
            Inicio
          </Link>

          {/* Login (si no hay token) */}
          {!store.token && (
            <>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginHotel">
                <FontAwesomeIcon icon={faHotel} className="me-1" />
                Hotel
              </Link>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginHouseKeeper">
                <FontAwesomeIcon icon={faBroom} className="me-1" />
                Housekeeper
              </Link>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginMaintenance">
                <FontAwesomeIcon icon={faTools} className="me-1" />
                Mantenimiento
              </Link>
            </>
          )}

          {/* Logout (si hay token) */}
          {store.token && (
            <button className="btn btn-light btn-sm d-flex align-items-center" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
