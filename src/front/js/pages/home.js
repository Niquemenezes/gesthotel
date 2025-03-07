import React, { Suspense } from "react";
import ListaCategorias from "../component/listaCategoria";
import "../../styles/home.css";

export const Home = () => {
    return (
        <>
            <div className="text-center mt-5">
                <h1 aria-live="polite">Bienvenido</h1>
            </div>

            {/* Manejo de carga y errores */}
            <Suspense fallback={<div className="text-center mt-3">Cargando categorías...</div>}>
                <ListaCategorias />
            </Suspense>
        </>
    );
};
