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
                    <button
                        type="submit"
                        className="btn btn-lg w-100 text-white"
                        style={{ 
                            backgroundColor: "#6b72dd",
                            transition: "all 0.3s ease",
                            border: "none",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#5a62c9";
                            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#6b72dd";
                            e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                        }}
                    >
                        <i className="fas fa-user-plus me-2"></i> Registrarse
                    </button>
                </div>

                <p className="mt-3 text-center text-secondary">
                    ¿Ya tienes cuenta?{" "}
                    <Link 
                        to="/LoginHotel" 
                        style={{color: "#6b72dd", textDecoration: "none", fontWeight: "500", transition: "all 0.3s ease" }}
                        onMouseEnter={(e) => {e.target.style.color = "#5a62c9"; e.target.style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => {e.target.style.color = "#6b72dd"; e.target.style.textDecoration = "none"; }}
                    >
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default SignupHotel;
