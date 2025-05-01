import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/demo.css";
import "animate.css";

export const Demo = () => {
    const navigate = useNavigate();

    const roles = [
        { name: "Administrador", icon: "👔" },
        { name: "Gobernanta", icon: "📝" },
        { name: "Camarera de Piso", icon: "🧹" },
        { name: "Recepción", icon: "🏨" },
        { name: "Mantenimiento", icon: "🛠️" },
        { name: "Jefe de Mantenimiento", icon: "🔧" }
    ];

    return (
        <div className="demo-page">
            <div className="no-navbar">
                <section
                    className="demo-hero d-flex align-items-center justify-content-center text-white text-center py-5"
                    style={{
                        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "60vh"
                    }}
                >
                    <div className="container px-3">
                        <h1 className="display-4 fw-bold mb-3">GestHotel</h1>
                        <p className="lead">Selecciona tu rol para acceder</p>
                    </div>
                </section>

                <section className="container my-5 py-4">
                    <div
                        className="card border-0 shadow-lg text-white text-center p-4 animate__animated animate__fadeInUp"
                        style={{
                            background: "linear-gradient(135deg, #3498db, #2980b9)",
                            borderRadius: "20px"
                        }}
                    >
                        <h2 className="mb-4">Roles Disponibles</h2>
                        <div className="row justify-content-center">
                            {roles.map((role, index) => (
                                <div
                                    key={index}
                                    className="col-6 col-md-4 col-lg-2 mb-4"
                                    onClick={() => navigate("/login", { state: { role: role.name.toLowerCase() } })}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div
                                        className="role-card h-100 d-flex flex-column align-items-center justify-content-center p-3 rounded shadow-sm"
                                        style={{
                                            background: "linear-gradient(135deg, #0dcaf0, #0a91d3)",
                                            transition: "all 0.3s ease",
                                            height: "150px"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.05)";
                                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        <div className="display-5 mb-2">{role.icon}</div>
                                        <div className="fw-bold">{role.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container text-center mt-4">
                    <button
                        className="btn btn-outline-light"
                        onClick={() => navigate("/")}
                    >
                        ← Volver al Inicio
                    </button>
                </div>

                <footer className="bg-dark text-white py-3 text-center mt-5">
                    <p className="mb-0 small">© 2025 GestHotel. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};
