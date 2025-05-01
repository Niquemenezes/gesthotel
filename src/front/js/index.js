//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

// tus estilos globales
import "../styles/index.css";

// estilos de terceros
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

// componentes
import Layout from "./layout";

// scripts de terceros
import "bootstrap/dist/js/bootstrap.bundle.min";

// render
ReactDOM.render(<Layout />, document.querySelector("#app"));
