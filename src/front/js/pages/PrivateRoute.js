import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import { jwtDecode } from "jwt-decode";

export const PrivateRoute = ({ roles = [], children }) => {
  const { store } = React.useContext(Context);
  const location = useLocation();
  const token = store.token;

  // Si no hay token, redirige al login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch {
    // Token inválido, redirige al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica roles permitidos
  if (!roles.includes(decoded.rol)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Todo OK, renderiza el componente
  return children;
};
