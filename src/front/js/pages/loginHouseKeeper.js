import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../component/authLayout';
import "../../styles/login.css";

const LoginHouseKeeper = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor ingresa tu email y contraseña');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/loginHouseKeeper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/privateHouseKeeper');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Algo salió mal. Intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un error al intentar iniciar sesión, por favor intenta más tarde.');
    }
  };
   // Efecto para cambiar el color del navbar
   useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.backgroundColor = "#27ae60"; // Verde housekeeper
      
      // Restablecer al color original al salir de la página
      return () => {
        navbar.style.backgroundColor = "#6b72dd"; // Color original (lila)
      };
    }
  }, []);

  return (
    <AuthLayout role="housekeeper">
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo electrónico</label>
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
          <label htmlFor="password" className="form-label">Contraseña</label>
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

        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-lg w-100 text-white"
            style={{ backgroundColor: "#27ae60", transition: "all 0.3s ease", border: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.1)"}}
            onMouseEnter={(e) => { e.target.style.backgroundColor = "#219653"; e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";}}
            onMouseLeave={(e) => { e.target.style.backgroundColor = "#27ae60"; e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)"; }}
          >
            Iniciar sesión
          </button>
        </div>
        <p className="mt-3 text-center text-secondary">
          ¿Necesitas ayuda?{" "}
          <span
            style={{
              color: "#27ae60", textDecoration: "none", fontWeight: "500", transition: "all 0.3s ease", cursor: "pointer"}}
            onMouseEnter={(e) => {e.target.style.color = "#219653"; e.target.style.textDecoration = "underline";}}
            onMouseLeave={(e) => {e.target.style.color = "#27ae60"; e.target.style.textDecoration = "none";}}
          >
            Contacta al administrador
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginHouseKeeper;