import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import AutocompleteWithMap from "../component/autoComplete";
import PrivateLayout from "../component/privateLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

const ListaBranches = () => {
    const { store, actions } = useContext(Context);
    const [branchSeleccionado, setBranchSeleccionado] = useState(null);
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getBranches();
    }, []);

    const handleLatLngChange = (lat, lng) => {
        setLatitud(lat);
        setLongitud(lng);
    };

    const resetForm = () => {
        setBranchSeleccionado(null);
        setNombre("");
        setDireccion("");
        setLatitud(null);
        setLongitud(null);
        setMostrarFormulario(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!nombre || nombre.trim() === "") {
          alert("El nombre de la sucursal es obligatorio.");
          return;
        }
      
        if (!direccion || direccion.trim() === "") {
          alert("La dirección es obligatoria.");
          return;
        }
      
        const branchData = {
          nombre,
          direccion,
          latitud,
          longitud
        };
      
        console.log("Datos que se envían:", branchData); // DEBUG
      
        try {
          await actions.createOrUpdateBranch(branchData, branchSeleccionado);
          await actions.getBranches();
          resetForm();
          navigate("/listaBranches");
        } catch (error) {
          alert("Error al guardar sucursal: " + error.message);
        }
      };
      

    const eliminarBranch = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta sucursal?")) return;
        try {
            await actions.deleteBranch(id);
            await actions.getBranches();
        } catch (error) {
            alert("Error al eliminar: " + error.message);
        }
    };

    return (
        <PrivateLayout>
            <div className="container">
                <h2 className="text-center my-3">Sucursales</h2>
                <div className="d-flex justify-content-center mb-4">
                    <button
                        className="btn text-white"
                        style={{ backgroundColor: "#0dcaf0", border: "none" }}
                        onClick={() => {
                            resetForm();
                            setMostrarFormulario(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        Crear Sucursal
                    </button>
                </div>

                <div className="row bg-light p-2 fw-bold border-bottom">
                    <div className="col">Nombre</div>
                    <div className="col">Dirección</div>
                    <div className="col text-center">Acciones</div>
                </div>

                {Array.isArray(store.branches) &&
                    store.branches.map((branch) => (
                        <div
                            key={branch.id}
                            className="row p-2 border-bottom align-items-center"
                        >
                            <div className="col">{branch.nombre}</div>
                            <div className="col">{branch.direccion}</div>
                            <div className="col d-flex justify-content-center">
                                <button
                                    className="btn me-2 text-white"
                                    style={{ backgroundColor: "#0dcaf0", border: "none" }}
                                    onClick={() => {
                                        setBranchSeleccionado(branch);
                                        setNombre(branch.nombre);
                                        setDireccion(branch.direccion);
                                        setLatitud(branch.latitud);
                                        setLongitud(branch.longitud);
                                        setMostrarFormulario(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => eliminarBranch(branch.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))}

                {mostrarFormulario && (
                    <div className="card p-4 mt-5 shadow-sm">
                        <h3 className="text-center mb-4">
                            {branchSeleccionado ? "Editar Sucursal" : "Crear Sucursal"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Nombre de la sucursal"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />

                            <AutocompleteWithMap
                                value={direccion}
                                onChange={setDireccion}
                                onSelect={setDireccion}
                                onLatLngChange={handleLatLngChange}
                            />

                            <button
                                type="submit"
                                className="btn w-100 text-white mt-3"
                                style={{ backgroundColor: "#0dcaf0", border: "none" }}
                            >
                                <FontAwesomeIcon icon={faSave} className="me-2" />
                                {branchSeleccionado ? "Guardar Cambios" : "Crear Sucursal"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </PrivateLayout>
    );
};

export default ListaBranches;
