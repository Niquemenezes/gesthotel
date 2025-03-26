import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    if (!store) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-page">
            {/* --- Hero Section (Estilo profesional oscuro) --- */}
            <section
                className="hero-section d-flex align-items-center py-5"
                style={{
                    background: "linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)",
                    color: "white",
                    minHeight: "80vh"
                }}
            >
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-4 fw-bold mb-4">
                                Transforma la gestión de tu hotel con <span className="text-info">nuestra API</span>
                            </h1>
                            <p className="lead mb-4">
                                Automatiza incidencias, coordina equipos y optimiza recursos con una plataforma diseñada para la <strong>hotelería moderna</strong>.
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                                <button
                                    className="btn btn-info btn-lg px-4"
                                    onClick={() => navigate("/demo")} // Redirige a /demo
                                >
                                    Ver Demo
                                </button>
                                <button className="btn btn-outline-light btn-lg px-4">Documentación</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Features (Tarjetas estilo Hyper SaaS) --- */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Solución Todo-en-Uno</h2>
                        <p className="text-muted">Gestiona todo tu hotel sin complicaciones.</p>
                    </div>
                    <div className="row g-4">
                        {[
                            {
                                icon: "🏨",
                                title: "Multi-sucursal",
                                desc: "Control centralizado para todas tus ubicaciones.",
                                color: "text-primary"
                            },
                            {
                                icon: "🛠️",
                                title: "Mantenimiento",
                                desc: "Asignación inteligente de tareas a técnicos.",
                                color: "text-success"
                            },
                            {
                                icon: "🧹",
                                title: "Limpieza",
                                desc: "Seguimiento en tiempo real de las camareras.",
                                color: "text-warning"
                            }
                        ].map((feature, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm p-4 hover-scale"> {/* Agrega animación en CSS */}
                                    <div className={`fs-1 mb-3 ${feature.color}`}>{feature.icon}</div>
                                    <h3 className="h5 fw-bold">{feature.title}</h3>
                                    <p className="text-muted">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- How it Works --- */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2 className="fw-bold mb-4">Flujo de trabajo optimizado</h2>
                            <ul className="list-unstyled">
                                {[
                                    "Reporte de incidencia → Asignación automática → Notificación al técnico → Resolución → Confirmación",
                                    "Dashboard en tiempo real para administradores.",
                                    "Integración con sistemas de mensajería (WhatsApp, Email)."
                                ].map((item, index) => (
                                    <li key={index} className="mb-3 d-flex align-items-start">
                                        <span className="me-2 text-primary">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            {/* Espacio para un diagrama SVG o imagen técnica real */}
                            <div className="bg-white p-4 rounded-3 shadow-sm text-center">
                                <p className="text-muted">[Diagrama de flujo o captura de pantalla real]</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Testimonios (Placeholder para cuando tengas clientes) --- */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Experiencias de hoteles</h2>
                        <p className="text-muted">*Próximamente: testimonios reales*</p>
                    </div>
                </div>
            </section>

            {/* --- CTA Final (Coherente con el navbar) --- */}
            <section
                className="py-5 text-white"
                style={{
                    background: "linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%)"
                }}
            >
                <div className="container text-center">
                    <h2 className="fw-bold mb-4">¿Listo para optimizar tu operación?</h2>
                    <p className="lead mb-4">Contáctanos para una demo personalizada.</p>
                    <button className="btn btn-info btn-lg px-4">Solicitar Acceso</button>
                </div>
            </section>
        </div>
    );
};