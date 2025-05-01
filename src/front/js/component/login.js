import React, { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import AuthLayout from "../component/authLayout";

const LoginUnico = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const preselectedRole = location.state?.role || "Administrador";
    const [rol, setRol] = useState(preselectedRole);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await actions.loginUnico(email, password, rol);
        setIsLoading(false);

        const rolLower = rol.toLowerCase();
        if (rolLower === "administrador") {
            navigate("/privateHotel");
        } else {
            navigate(`/private/${rolLower.replace(" ", "-")}`);
        }

        if (!response.success) {
            setError(response.msg);
        }
    };



    return (
        <AuthLayout role={rol}>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    className="form-select mb-3"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                >
                    <option value="administrador">Administrador</option>
                    <option value="gobernanta">Gobernanta</option>
                    <option value="camarera de piso">Camarera de Piso</option>
                    <option value="recepcion">Recepción</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="jefe de mantenimiento">Jefe de Mantenimiento</option>
                </select>

                {error && <div className="alert alert-danger">{error}</div>}

                <button className="btn btn-info w-100 mb-3">Iniciar sesión</button>

                {rol === "administrador" && (
                    <div className="text-center">
                        <Link to="/signup" className="text-decoration-none">
                            ¿No tienes cuenta? <strong>Regístrate aquí</strong>
                        </Link>
                    </div>
                )}

            </form>
        </AuthLayout>
    );
};

export default LoginUnico;
