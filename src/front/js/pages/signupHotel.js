import React, { useState } from "react";

const SignupHotel = () => {
  const [hotelName, setHotelName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear un objeto con los datos del nuevo hotel
    const hotelData = {
      hotelName,
      email,
      password,
    };

    // Hacer la petición para registrar el hotel
    fetch("/api/hoteles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotelData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage("Hotel registrado exitosamente!");
          setHotelName("");
          setEmail("");
          setPassword("");
        } else {
          setErrorMessage("Hubo un problema al registrar el hotel.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Error en el servidor. Intenta nuevamente.");
      });
  };

  return (
    <div className="container" style={{ width: "500px", marginTop: "50px" }}>
      <h2 className="text-center mb-4">Registrar Hotel</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Hotel</label>
          <input
            type="text"
            className="form-control"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email del Administrador</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn w-100" style={{ backgroundColor: "#9b5de5", borderColor: "#B7A7D1" }}>
          Registrar
        </button>
      </form>
    </div>
  );
};

export default SignupHotel;
