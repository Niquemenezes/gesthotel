import React from "react"
import { Link } from "react-router-dom";


const Sidebar = () => {
    
    return (

        <div className="sidebar" style={{ width: "250px", backgroundColor: "#3f1d77", minHeight: "86vh" }}>
          <div className="d-flex flex-column align-items-start p-3">
            <h4 className="text-white mb-4">Hotel Dashboard</h4>
            <Link className="nav-link text-white mb-2" to="/listaHoteles">Hoteles</Link>
            <Link className="nav-link text-white mb-2" to="/listaBranches">Branches</Link>
            <Link className="nav-link text-white mb-2" to="/theme">Theme Form</Link>
            <Link className="nav-link text-white mb-2" to="/listaCat">Category Form</Link>
            <Link className="nav-link text-white mb-2" to="/hoteltheme">Hotel Theme Form</Link>
            <Link className="nav-link text-white mb-2" to="/listaRoom">Room</Link>
            <Link className="nav-link text-white mb-2" to="/ListaMaintenance">Maintenance</Link>
            <Link className="nav-link text-white mb-2" to="/houseKeeper">HouseKeeper Form</Link>
            <Link className="nav-link text-white mb-2" to="/HouseKeeperTask">House Keeper Task Form</Link>
            <Link className="nav-link text-white mb-2" to="/maintenanceTask">Maintenance Task Form</Link>
          </div>
        </div>

    );
};

export default Sidebar