import React, { useState } from "react";

const CloudinaryApiHotel = ({ setPhotoUrl, setErrorMessage, taskId }) => {
  const [errorMessage, setLocalErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file); // 👈 Esto debería mostrar el archivo
  
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Apihotel");
  
      fetch("https://api.cloudinary.com/v1_1/dnftnyi5g/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta Cloudinary:", data);
          if (data.secure_url) {
            setPhotoUrl(taskId, data.secure_url);  // Llamar a setPhotoUrl pasando taskId y la URL
          } else {
            setErrorMessage("No se recibió la URL de la imagen");
          }
        })
        .catch((err) => {
          console.error("Error Cloudinary:", err);
          setErrorMessage("Error al subir la imagen.");
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
    </div>
  );
};

export default CloudinaryApiHotel;
