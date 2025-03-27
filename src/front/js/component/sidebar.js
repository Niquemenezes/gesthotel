import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import { Tooltip } from "bootstrap"; // 👈 importante
import {  faHome,  faCodeBranch,  faList,  faBed,  faTools,  faUser,  faClipboardList,  faWrench,  faBars, }
from "@fortawesome/free-solid-svg-icons";
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
  ];

  useEffect(() => {
    if (collapsed) {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new Tooltip(tooltipTriggerEl);
      });
    }
  }, [collapsed]);
 
    return (
      <div
        className={`sidebar ${collapsed ? "collapsed" : ""}`}
        style={{
          backgroundColor: "#2A3042",
          minHeight: "100vh",
          width: collapsed ? "70px" : "250px",
          transition: "width 0.3s ease",
          position: "fixed",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div className="sidebar-header p-3">
          <div className="d-flex justify-content-between align-items-center">
            {!collapsed && (
              <h5 className="text-white mb-0">
                <span className="fw-bold">HOTEL</span> ADMIN
              </h5>
            )}
            <button className="sidebar-toggle-btn btn btn-sm btn-light" onClick={toggleCollapsed}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
        </div>
    
        {/* Menú con efectos hover */}
        <div className="sidebar-menu px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={index}
                to={item.to}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                title={collapsed ? item.label : ""}
                data-bs-toggle={collapsed ? "tooltip" : null}
                data-bs-placement="right"
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