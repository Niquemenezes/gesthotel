import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/demo.css";

export const Demo = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 1,
            name: "Administrador",
            desc: "Gestiona hoteles, sucursales y reportes globales.",
            icon: "👔",
            bgColor: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            path: "/loginHotel"
        },
        {
            id: 2,
            name: "Mantenimiento",
            desc: "Resuelve incidencias técnicas reportadas.",
            icon: "🛠️",
            bgColor: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
            path: "/loginMaintenance"
        },
        {
            id: 3,
            name: "Housekeeping",
            desc: "Gestiona limpieza y tareas de habitaciones.",
            icon: "🧹",
            bgColor: "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)",
            path: "/loginHouseKeeper"
        }
    ];

    return (
        <div className="demo-page">
            <div className="no-navbar"> {/* Esta clase oculta el Navbar */}
                {/* --- Hero Section --- */}
                <section
                    className="demo-hero d-flex align-items-center justify-content-center text-white text-center py-5"
                    style={{
                        background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "50vh"
                    }}
                >
                    <div className="container px-3">
                        <h1 className="display-5 fw-bold mb-3">Bienvenido a API Hotel</h1>
                        <p className="lead mb-0">
                            Selecciona tu rol para acceder al sistema.
                        </p>
                    </div>
                </section>

                {/* --- Cards de Roles --- */}
                <section className="container my-4 py-3">
                    <div className="row g-4 justify-content-center">
                        {roles.map((role) => (
                            <div key={role.id} className="col-12 col-md-6 col-lg-4">
                                <div
                                    className="card role-card h-100 border-0 text-white shadow-lg"
                                    style={{ background: role.bgColor }}
                                    onClick={() => navigate(role.path)}
                                >
                                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                                        <span className="display-3 mb-3">{role.icon}</span>
                                        <h2 className="h4 fw-bold text-center">{role.name}</h2>
                                        <p className="text-center mb-0">{role.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <section class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="text-center">
                        <h1 class="mt-0"><i class="mdi mdi-heart-multiple-outline"></i></h1>
                        <h3>Features you'll <span class="text-danger">love</span></h3>
                        <p class="text-muted mt-2">Hyper comes with next generation ui design and have multiple benefits
                        </p>
                    </div>
                </div>
            </div>
            <div class="row mt-2 py-5 align-items-center">
                <div class="col-lg-5 col-md-6">
                    <img src="assets/images/svg/features-1.svg" class="img-fluid" alt=""/>
                </div>
                <div class="col-lg-6 offset-md-1 col-md-5">
                    <h3 class="fw-normal">Inbuilt applications and pages</h3>
                    <p class="text-muted mt-3">Hyper comes with a variety of ready-to-use applications and pages that help to speed up the development</p>

                    <div class="mt-4">
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-primary"></i> Projects &amp; Tasks</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-primary"></i> Ecommerce Application Pages</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-primary"></i> Profile, pricing, invoice</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-primary"></i> Login, signup, forget password</p>
                    </div>

                    <a href="" class="btn btn-primary rounded-pill mt-3">Read More <i class="mdi mdi-arrow-right ms-1"></i></a>

                </div>
            </div>

            <div class="row pb-3 pt-5 align-items-center">
                <div class="col-lg-6 col-md-5">
                    <h3 class="fw-normal">Simply beautiful design</h3>
                    <p class="text-muted mt-3">The simplest and fastest way to build dashboard or admin panel. Hyper is built using the latest tech and tools and provide an easy way to customize anything, including an overall color schemes, layout, etc.</p>

                    <div class="mt-4">
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-success"></i> Built with latest Bootstrap</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-success"></i> Extensive use of SCSS variables</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-success"></i> Well documented and structured code</p>
                        <p class="text-muted"><i class="mdi mdi-circle-medium text-success"></i> Detailed Documentation</p>
                    </div>

                    <a href="" class="btn btn-success rounded-pill mt-3">Read More <i class="mdi mdi-arrow-right ms-1"></i></a>

                </div>
                <div class="col-lg-5 col-md-6 offset-md-1">
                    <img src="assets/images/svg/features-2.svg" class="img-fluid" alt=""/>
                </div>
            </div>

        </div>
    </section>

                {/* --- Botón "Volver al Home" (Opcional) --- */}
                <div className="container text-center mt-3">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/")}
                    >
                        ← Volver al Inicio
                    </button>
                </div>

                {/* --- Footer --- */}
                <footer className="bg-dark text-white py-3 text-center mt-5">
                    <p className="mb-0 small">© 2023 API Hotel. Todos los derechos reservados.</p>
                </footer>
            </div>
        </div>
    );
};