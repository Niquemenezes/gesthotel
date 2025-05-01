import React, { useState, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import AuthLayout from "../component/authLayout";

const SignupHotel = () => {
    const { actions } = useContext(Context);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.signupHotel(nombre, email, password);
        if (success) {
            setRedirect(true);
        } else {
            setError("No se pudo registrar el hotel. Verifica los datos.");
        }
    };

    if (redirect) return <Navigate to="/login" />;

    return (
        <AuthLayout role="signup">
            <form onSubmit={handleSubmit} className="container px-4">
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label text-secondary">Nombre del Hotel</label>
                    <input
                        type="text"
                        id="nombre"
                        className="form-control form-control-lg"
                        placeholder="Hotel Example"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label text-secondary">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control form-control-lg"
                        placeholder="correo@ejemplo.com"
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
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid">
                    <button
                        type="submit"
                        className="btn btn-lg text-white"
                        style={{
                            backgroundColor: "#0dcaf0",
                            transition: "all 0.3s ease",
                            border: "none",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#1bc1d2";
                            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#0dcaf0";
                            e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                        }}
                    >
                        <i className="fas fa-user-plus me-2"></i> Registrar Hotel
                    </button>
                </div>

                <p className="mt-4 text-center text-secondary">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        to="/login"
                        className="text-decoration-none fw-bold text-info"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignupHotel;
