// src/front/js/component/AuthHotel.jsx
import React, { useState } from "react";
import SignupHotel from "../pages/signupHotel";
import LoginHotel from "../pages/loginHotel";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/login.css";
import equipo from "../../img/equipo.png";

const AuthHotel = () => {
    const [isSignup, setIsSignup] = useState(false);

    const handleSignup = () => setIsSignup(true);
    const handleGoToLogin = () => setIsSignup(false);

    return (
        <div className="container-fluid auth-fluid">
        <div className="row w-100">
          {/* Lado izquierdo: formulario */}
          <div className="col-md-5 auth-left d-flex flex-column h-100">
            <div className="auth-fluid-form-box my-auto">
              <div className="card-body">
                <div className="text-center mb-4">
                  <h4 className="fw-bold">
                    {isSignup ? "Crea tu cuenta" : "Bienvenido de nuevo"}
                  </h4>
                  <p className="text-muted">
                    {isSignup
                      ? "Regístrate para comenzar a gestionar tu hotel"
                      : "Ingresa con tu cuenta para continuar"}
                  </p>
                </div>
      
                {/* Formulario */}
                {isSignup ? <SignupHotel /> : <LoginHotel />}
      
                <div className="mt-3 text-center">
                  {isSignup ? (
                    <p>
                      ¿Ya tienes cuenta?{" "}
                      <button onClick={handleGoToLogin} className="btn btn-link p-0">
                        Inicia sesión
                      </button>
                    </p>
                  ) : (
                    <p>
                      ¿No tienes cuenta?{" "}
                      <button onClick={handleSignup} className="btn btn-link p-0">
                        Regístrate
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
      
          {/* Lado derecho: imagen */}
          <div className="col-md-7 auth-right d-none d-md-flex p-0">
            <img
              src={equipo}
              alt="Equipo del hotel"
              className="auth-img"
            />
          </div>
        </div>
      </div>
    )      
};

export default AuthHotel;
