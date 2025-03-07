import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarCategoria = () => {
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Obtener el ID de la categoría desde la URL
    const navigate = useNavigate();

    // Función para obtener la URL del backend de forma segura
    const getBackendUrl = () => {
        const baseUrl = process.env.BACKEND_URL;
        if (!baseUrl) {
            console.error("Error: BACKEND_URL no está definido.");
            setError("Error interno: No se ha configurado la URL del servidor.");
            return null;
        }
        return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    };

    // Cargar los datos de la categoría al montar el componente
    useEffect(() => {
        const cargarCategoria = async () => {
            const apiUrl = getBackendUrl();
            if (!apiUrl) return;

            try {
                const response = await fetch(`${apiUrl}api/categorias/${id}`);
                if (!response.ok) {
                    throw new Error("Error al cargar la categoría");
                }
                const data = await response.json();
                setNombre(data.nombre);
            } catch (error) {
                setError(error.message);
            } finally {
                setCargando(false);
            }
        };

        cargarCategoria();
    }, [id]);

    // Manejar la actualización de la categoría
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setError(null);

        const apiUrl = getBackendUrl();
        if (!apiUrl) return;

        try {
            const response = await fetch(`${apiUrl}api/categorias/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: nombre.trim() }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la categoría.");
            }

            alert("Categoría actualizada correctamente.");
            navigate("/"); // Redirigir a la página principal
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <div className="text-center mt-5">Cargando...</div>;
    }

    if (error) {
        return <div className="text-center text-danger mt-5">Error: {error}</div>;
    }

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card p-4" style={{ width: "300px" }}>
                <h1 className="text-center mb-4">Editar Categoría</h1>
                {error && <div className="alert alert-danger text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="form-control"
                            placeholder="Nombre"
                            required
                            disabled={cargando}
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-warning w-100" disabled={cargando}>
                            {cargando ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarCategoria;