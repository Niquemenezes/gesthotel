import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate, Link } from "react-router-dom";
import AuthLayout from "../component/authLayout";
import "../../styles/home.css";



const SignupHotel = () => {
    const { actions } = useContext(Context);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.signup(nombre, email, password);
        if (success) {
            setRedirect(true);
        } else {
            setError("No se pudo registrar el hotel. Verifica los datos.");
        }
    };

    if (redirect) return <Navigate to="/loginHotel" />;

    return (
        <AuthLayout>
            <div className="text-center mb-4">
                <h2 className="text-secondary">Inicia sesión</h2>
                <p className="text-muted">Crea una cuenta para tu hotel</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label text-secondary">Nombre del hotel</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control form-control-lg"
                        placeholder="Hotel Example"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-secondary">Correo electrónico</label>
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
                    <label htmlFor="password" className="form-label text-secondary">Contraseña</label>
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

                <div className="form-check mb-3">
                    <input type="checkbox" className="form-check-input" id="checkbox-signup" required />
                    <label className="form-check-label text-secondary" htmlFor="checkbox-signup">
                        Acepto los Términos y Condiciones
                    </label>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        <i className="fas fa-user-plus me-2"></i> Registrarse
                    </button>


                </div>

                <p className="mt-3 text-center text-secondary">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/LoginHotel" className="link-lila">Inicia sesión</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignupHotel;
