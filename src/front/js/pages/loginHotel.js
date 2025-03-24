import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../component/authLayout";
import "../../styles/login.css";


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
        <AuthLayout>
            <div className="text-center mb-4">
                <h2 className="text-secondary">Inicia sesión</h2>
                <p className="text-muted">Ingresa con los datos de tu hotel</p>
            </div>

            <form onSubmit={handleSubmit}>
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
                        placeholder="Introduce tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        <i className="fas fa-sign-in-alt me-2"></i> Iniciar sesión
                    </button>




                </div>

                <p className="mt-3 text-center text-secondary">
                    ¿No tienes cuenta?{" "}
                    <Link to="/signupHotel" className="link-lila">Regístrate</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginHotel;