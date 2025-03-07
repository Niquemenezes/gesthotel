import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link to="/" className="navbar-brand">Lista de Categorias</Link>
                <Link to="/crear" className="btn btn-primary">Crear Categoria</Link>
            </div>
        </nav>
    );
};

export default Navbar;
