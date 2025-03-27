import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faBroom, faTools, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/loginHotel");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#0dcaf0" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fs-3 fw-bold" to="/">
          APIHOTEL
        </Link>

        <div className="ms-auto d-flex align-items-center gap-3">
          {!store.token && (
            <>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginHotel">
                <FontAwesomeIcon icon={faHotel} className="me-2" />
                Hotel
              </Link>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginHouseKeeper">
                <FontAwesomeIcon icon={faBroom} className="me-2" />
                Housekeeper
              </Link>
              <Link className="btn btn-outline-light btn-sm d-flex align-items-center" to="/loginMaintenance">
                <FontAwesomeIcon icon={faTools} className="me-2" />
                Mantenimiento
              </Link>
            </>
          )}

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
