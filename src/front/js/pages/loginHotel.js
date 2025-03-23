import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const LoginHotel = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.login(email, password).then(success => {
            if (success) {
                navigate("/privatehotel");
            } else {
                setError("Usuario no encontrado. Verifica tu email o contraseña.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-0 d-grid text-center">
                <button type="submit" className="btn">
                    Iniciar sesión
                </button>
            </div>
        </form>
    );
};

export default LoginHotel;
