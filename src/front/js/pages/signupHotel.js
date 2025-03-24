import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

const SignupHotel = () => {
    const { actions } = useContext(Context);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.signup(nombre, email, password);
        setRedirect(true);
    };

    if (redirect) return <Navigate to="/loginhotel" />;

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del hotel</label>
                <input
                    type="text"
                    id="name"
                    className="form-control form-control-lg"
                    placeholder="Introduce el nombre del hotel"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo electrónico</label>
                <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="Introduce tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="Crea una contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="form-check mb-4">
                <input type="checkbox" className="form-check-input" id="checkbox-signup" required />
                <label className="form-check-label" htmlFor="checkbox-signup">
                    Acepto los Términos y Condiciones
                </label>
            </div>

            <div className="mb-0 d-grid text-center">
                <button type="submit" className="btn">
                    Registrarse
                </button>
            </div>
        </form>
    );
};

export default SignupHotel;
