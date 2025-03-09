import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Demo = () => {
    const { store, actions } = useContext(Context);

    // Verificar si store.demo es un array antes de mapear
    if (!Array.isArray(store.demo)) {
        return <div className="text-center text-danger mt-5">Error: Datos no disponibles.</div>;
    }

    return (
        <div className="container">
            <ul className="list-group">
                {store.demo?.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        style={{ background: item.background || "transparent" }} // Evita valores undefined
                    >
                        <Link to={`/single/${index}`}>
                            <span>Link to: {item.title}</span>
                        </Link>

                        {item.background === "orange" && (
                            <p style={{ color: item.initial }}>
                                Check store/flux.js scroll to the actions to see the code
                            </p>
                        )}

                        <button
                            className="btn btn-success"
                            onClick={() => actions.changeColor(index, "orange")}
                        >
                            Change Color
                        </button>
                    </li>
                ))}
            </ul>

            <div className="text-center mt-3">
                <Link to="/">
                    <button className="btn btn-primary">Back home</button>
                </Link>
            </div>
        </div>
    );
};
