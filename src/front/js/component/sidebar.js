import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
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
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/sidebar.css"; // Asegúrate de tener este archivo

const Sidebar = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: faHome, label: "Dashboard", to: "/privatehotel" },
    { icon: faCodeBranch, label: "Branches", to: "/listaBranches" },
    { icon: faBed, label: "Habitaciones", to: "/listaRoom" },
    { icon: faUser, label: "Camareras", to: "/houseKeeper" },
    { icon: faTools, label: "Técnicos", to: "/listaMaintenance" },
    { icon: faClipboardList, label: "Tareas Limpieza", to: "/HouseKeeperTask" },
    { icon: faWrench, label: "Tareas Mantenimiento", to: "/maintenanceTask" },
    { icon: faList, label: "Categorías", to: "/listaCat" },
    { icon: faPalette, label: "Temas", to: "/theme" },   
    { icon: faHotel, label: "Temas Hotel", to: "/hoteltheme" },
    { icon: faBuilding, label: "Hoteles", to: "/listaHoteles" },
  ];

  return (
    <div
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        backgroundColor: "#2a3042",
        minHeight: "100vh",
        width: collapsed ? "70px" : "250px",
        transition: "width 0.3s ease",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div className="sidebar-header">
        <div className="d-flex justify-content-between align-items-center">
          {!collapsed && (
            <h5 className="text-white mb-0">
              <span className="fw-bold">HOTEL</span> ADMIN
            </h5>
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={toggleCollapsed}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Menú con efectos hover */}
      <div className="sidebar-menu">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={index}
              to={item.to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <div className="sidebar-link-content">
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`sidebar-icon ${collapsed ? "collapsed-icon" : ""}`} 
                />
                {!collapsed && (
                  <span className="sidebar-link-text">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;