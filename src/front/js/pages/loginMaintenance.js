import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../component/authLayout';
import "../../styles/login.css";

const LoginMaintenance = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Efecto para cambiar el color del navbar
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.style.backgroundColor = "#e67e22"; // Naranja maintenance
      navbar.style.transition = "background-color 0.3s ease";
      
      return () => {
        navbar.style.backgroundColor = "#6b72dd"; // Color original (lila)
      };
    }
  }, []);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor ingresa tu email y contraseña');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}api/loginMaintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/privateMaintenance');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Credenciales incorrectas. Intenta nuevamente.'}`);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Hubo un problema al intentar iniciar sesión. Inténtalo más tarde.');
    }
  };

  return (
    <AuthLayout role="maintenance">
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
            style={{ backgroundColor: "#e67e22", transition: "all 0.3s ease", border: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.1)"}}
            onMouseEnter={(e) => {e.target.style.backgroundColor = "#d35400"; e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";}}
            onMouseLeave={(e) => { e.target.style.backgroundColor = "#e67e22"; e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";}}
          >
            Iniciar sesión
          </button>
        </div>

        <p className="mt-3 text-center text-secondary">
          <span
            style={{color: "#e67e22", textDecoration: "none", fontWeight: "500", transition: "all 0.3s ease", cursor: "pointer" }}
              onMouseEnter={(e) => {e.target.style.color = "#d35400"; e.target.style.textDecoration = "underline";}}
            onMouseLeave={(e) => {e.target.style.color = "#e67e22"; e.target.style.textDecoration = "none";}}
          >
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginMaintenance;