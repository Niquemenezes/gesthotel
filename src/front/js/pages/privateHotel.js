import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import Sidebar from "../component/sidebar";

const PrivateHotel = () => {
  const { store } = useContext(Context);
  const [collapsed, setCollapsed] = useState(false);

  const nombreHotel = store.hotel?.nombre || "tu hotel";

  return (
    <div className="d-flex">
      <Sidebar collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />

      <div
        className="flex-fill p-4"
        style={{
          marginLeft: collapsed ? "70px" : "250px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <div className="text-center">
          <h2>¡Bienvenida a la zona Hotel, {nombreHotel}!</h2>

          <img
            src="https://res.cloudinary.com/dnftnyi5g/image/upload/v1742292824/DALL_E_2025-03-18_10.06.33_-_A_logo_design_for_a_hotel_management_project_called_APIHOTEL._The_logo_should_have_a_modern_and_professional_style_featuring_a_shade_of_lilac_similar_huhask_Square_naq329.webp"
            alt="Logo del Hotel"
            style={{ width: "350px", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivateHotel;
