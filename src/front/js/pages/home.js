import React, { Suspense } from "react";
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <>
            <div className="text-center mt-5">
                <h1 aria-live="polite">Bienvenido</h1>
            </div>
            <Link to="/listaCat">Go to Theme Form</Link>
            <Link to="/theme">Go to Theme Form</Link>
        </>
    );
};
