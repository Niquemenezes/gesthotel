import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CrearCategoria = () => {
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Usamos useRef para mantener una referencia al estado de si el componente está montado o no
    const isMounted = useRef(true); // Esto se utilizará para evitar actualizaciones en un componente desmontado

    // Función para obtener la URL del backend
    const getBackendUrl = () => {
        const baseUrl = process.env.BACKEND_URL;
        if (!baseUrl) {
            console.error("Error: BACKEND_URL no está definido en las variables de entorno.");
            setError("Error interno: No se ha configurado la URL del servidor.");
            return null;
        }
        return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    };

    // Se ejecuta cuando el componente se desmonta
    useEffect(() => {
        // Cuando el componente se desmonta, se cambia la referencia a false
        isMounted.current = false;
        return () => {
            isMounted.current = false; // Se asegura de que cuando el componente se desmonte, no se actualice el estado
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombreTrim = nombre.trim();

        if (!nombreTrim) {
            setError("El nombre de la categoría es obligatorio.");
            return;
        }

        const apiUrl = getBackendUrl();
        if (!apiUrl) return;

        setCargando(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ nombre: nombreTrim }),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Leemos como texto en caso de error HTML
                throw new Error(errorData || "Error al crear la categoría.");
            }

            // Verifica que el contenido sea JSON
            const data = await response.json();
            setNombre("")

            alert("Categoría creada exitosamente.");
            navigate("/listaCat");

        } catch (error) {
            // Verifica si el componente está montado antes de actualizar el estado

            setError(error.message);

        } finally {
            // Asegúrate de que el componente esté montado antes de actualizar el estado

            setCargando(false);

        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card p-4" style={{ width: "300px" }}>
                <h1 className="text-center mb-4">Crear Categoría</h1>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="form-control"
                            placeholder="Nombre de la categoría"
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                            {cargando ? "Creando..." : "Crear Categoría"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearCategoria;