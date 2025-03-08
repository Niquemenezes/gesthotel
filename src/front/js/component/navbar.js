import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link to="/listaCategoria" className="btn btn-primary">Lista de Categorias</Link>
                <Link to="/crearCategoria" className="btn btn-primary">Crear Categoria</Link>
            </div>
        </nav>
    );
};

export default Navbar;
