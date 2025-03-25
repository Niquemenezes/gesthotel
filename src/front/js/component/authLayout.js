import React from "react";
import equipo from "../../img/equipo.png";

const AuthLayout = ({ children }) => {
    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-md-3 d-flex align-items-center justify-content-center bg-white">
                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        {children}
                    </div>
                </div>
                <div className="col-md-9 d-none d-md-block p-0">
                    <img
                        src={equipo}
                        alt="Hotel visual"
                        className="w-100 h-100"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
