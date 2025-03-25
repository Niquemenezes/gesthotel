import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faCodeBranch,
  faPalette,
  faList,
  faHotel,
  faBed,
  faTools,
  faUser,
  faClipboardList,
  faWrench,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/sidebar.css"; // Asegúrate de tener este archivo

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: faBuilding, label: "Hoteles", to: "/listaHoteles" },
    { icon: faCodeBranch, label: "Branches", to: "/listaBranches" },
    { icon: faPalette, label: "Theme Form", to: "/theme" },
    { icon: faList, label: "Category Form", to: "/listaCat" },
    { icon: faHotel, label: "Hotel Theme Form", to: "/hoteltheme" },
    { icon: faBed, label: "Room", to: "/listaRoom" },
    { icon: faTools, label: "Maintenance", to: "/listaMaintenance" },
    { icon: faUser, label: "Housekeeper Form", to: "/houseKeeper" },
    { icon: faClipboardList, label: "Housekeeper Task", to: "/HouseKeeperTask" },
    { icon: faWrench, label: "Maintenance Task", to: "/maintenanceTask" },
  ];

  return (
    <div
      className={`sidebar shadow ${collapsed ? "collapsed" : ""}`}
      style={{
        backgroundColor: "#343a40",
        minHeight: "100vh",
        width: collapsed ? "70px" : "250px",
        transition: "width 0.3s ease",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <div className="d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-white fw-bold">
            <FontAwesomeIcon icon={faHotel} className="me-2" />
            {!collapsed && "Hotel"}
          </h5>
          <button
            className="btn btn-sm btn-outline-light ms-auto"
            onClick={() => setCollapsed(!collapsed)}
            style={{ border: "none", background: "transparent" }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="nav-link text-white d-flex align-items-center mb-3"
          >
            <FontAwesomeIcon icon={item.icon} className="me-2" />
            {!collapsed && <span className="link-text">{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
