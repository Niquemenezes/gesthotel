import React from "react";
import "../../styles/home.css";
import ListaCategorias from "../component/listaCategoria";

export const Lista = () => {
    return (
        <>
            <div className="text-center mt-5">
                <h1 aria-live="polite">Hola</h1>
            </div>

            {/* Manejo de errores para ListaCategorias */}
            <React.Suspense fallback={<div className="text-center mt-3">Cargando categorías...</div>}>
                <ListaCategorias />
            </React.Suspense>
        </>
    );
};