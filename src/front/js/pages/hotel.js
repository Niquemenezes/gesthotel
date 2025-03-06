import React  from "react";
import "../../styles/home.css";
import ListaHoteles from "../component/listaHoteles";
import { Link } from "react-router-dom";


export const Hoteles = () => {
	
	return (
		<div className="text-center mt-5">
			<h1>Bienvenido</h1>
			<ListaHoteles/>
			<div className="mt-3">
                <Link to="/crear" className="btn btn-primary">Crear Hotel</Link>
            </div>
		</div>
	);
};
