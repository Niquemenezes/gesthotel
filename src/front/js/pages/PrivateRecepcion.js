import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import PrivateLayout from '../component/privateLayout';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const PrivateRecepcion = () => {
  const [rooms, setRooms] = useState([]);
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getReception();
}, []);
 

  const habitacionesLimpias = rooms.filter(room => room.estado === "limpia");
  const habitacionesSucias = rooms.filter(room => room.estado === "sucia");
  const habitacionesOcupadas = rooms.filter(room => room.ocupada === true); // Por ahora siempre vacío

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Recepción - Habitaciones</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Habitaciones Limpias</h2>
          {habitacionesLimpias.length > 0 ? habitacionesLimpias.map(room => (
            <div key={room.id} className="p-2 border-b">{room.nombre} ({room.branch_nombre})</div>
          )) : <p>No hay habitaciones limpias.</p>}
        </div>

        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Habitaciones Sucias</h2>
          {habitacionesSucias.length > 0 ? habitacionesSucias.map(room => (
            <div key={room.id} className="p-2 border-b">{room.nombre} ({room.branch_nombre})</div>
          )) : <p>No hay habitaciones sucias.</p>}
        </div>

        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Habitaciones Ocupadas</h2>
          {habitacionesOcupadas.length > 0 ? habitacionesOcupadas.map(room => (
            <div key={room.id} className="p-2 border-b">{room.nombre} ({room.branch_nombre})</div>
          )) : <p>No hay habitaciones ocupadas.</p>}
        </div>

      </div>
    </div>
  );
};

export default PrivateRecepcion;
