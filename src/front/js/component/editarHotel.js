import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const EditarHotel = () => {
    const [nombre, setNombre] = useState("");
    const [email,setEmail] = useState("");
    const {id} = useParams(); //obtener el ID del estudiante desde la URL
    const navigate = useNavigate();

    //carga los datos del estudiante cuando se monte el componente
   
    useEffect(() => {
        fetch(process.env.BACKEND_URL+ `/api/hoteles/${id}`,)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos del hotel");
                }
                return response.json();
            })
            .then((data) => {
                setNombre(data.nombre);
                setEmail(data.email);
            })
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
    //editar un hotel
       fetch(process.env.BACKEND_URL+ `/api/hoteles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({nombre, email})
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al actualizar: ${response.status}");
            }
            return response.json();
        })
        .then(() => navigate("/")) //redigirir a la pagina de inicio despues de guardar
    };
   
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card p-4" style={{ width: "300px" }}>
                <h1 className="text-center mb-4">Editar Hotel</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control" placeholder="Nombre"/>
                    </div>
                    <div className="mb-3">
                        <input type="text"value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email"/>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-warning w-100"> Guardar Cambios </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarHotel; 