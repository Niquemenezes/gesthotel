// src/layout.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import ThemeForm from './pages/theme';
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { ListaCat } from "./pages/listaCat";
import injectContext from "./store/appContext";

import Navbar from "./component/navbar";
import EditarCategoria from "./component/editarCategoria";
import CrearCategoria from "./component/crearCategoria";
import ListaCategoria from "./component/listaCategoria";
import EditarHotel from "./component/editarHotel";
import CrearHotel from "./component/crearHotel";
import ListaHoteles from "./component/listaHoteles";



const Layout = () => {
    // Basename: Usado si el proyecto está en un subdirectorio, configurado en .env
    const basename = process.env.BASENAME || "";

    // Si la variable de entorno BACKEND_URL no está configurada, muestra un mensaje de error
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") {
        return <BackendURL />;
    }
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>

                        <Route path="/" element={<Home />} />
                        <Route path="/listaCat" element={<ListaCat />} />
                        <Route path="/editar/:id" element={<EditarCategoria />} />
                        <Route path="/crearCategoria" element={<CrearCategoria />} />
                        <Route path="/listaCategoria" element={<ListaCategoria />} />
                        <Route path="/single/:theid" element={<Single />} />
                        <Route element={<ListaHoteles/>} path="/listaHoteles"/> 
                        <Route element={<EditarHotel/>} path="/editar-hotel/:id"/>
                        <Route element={<CrearHotel/>} path="/crearHotel"/>
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<ThemeForm />} path="/theme" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext (Layout);
