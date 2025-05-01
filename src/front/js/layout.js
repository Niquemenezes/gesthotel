import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import HouseKeeper from './pages/houseKeeper';
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import Hoteles from "./component/listaHoteles";
import Branches from "./pages/ListaBranches";
import ListaRoom from "./component/listaRoom";
import Maintenance from "./component/listaMaintenance";
import LoginUnico from "./component/login";
import SignupHotel from "./component/signup";
import PrivateHouseKeeper from './pages/privateHouseKeeper';
import ProtectedPrivateHouseKeeper from './pages/ProtectedPrivateHouseKeeper';
import HouseKeeperTask from './pages/HouseKeeperTask';
import PrivateHotel from "./pages/privateHotel";
import MaintenanceTask from './pages/maintenanceTask';
import PrivateMaintenance from './pages/privateMaintenance';
import ProtectedPrivateMaintenance from './pages/ProtectedPrivateMaintenance';
import { Footer } from "./component/footer";
import TaskFilterView from './pages/TaskFilterView';
import TaskFilterView2 from './pages/TaskFilterView2';
import MaintenanceWorkLog from "./pages/maintenanceWorkLog";
import HousekeeperWorkLog from "./pages/houseKeeperWorkLog";
import { PrivateRoute } from "./pages/PrivateRoute";
import PrivateGobernanta from "./pages/PrivateGobernanta";
import PrivateRecepcion from "./pages/PrivateRecepcion";
import PrivateJefeMantenimiento from "./pages/PrivateJefeMantenimiento";

const Layout = () => {
  const basename = process.env.BASENAME || "";
  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <RouterContent />
      </ScrollToTop>
    </BrowserRouter>
  );
};

const RouterContent = () => {
  const location = useLocation();
  const showNavFooter = !["/", "/demo"].includes(location.pathname);

  if (!process.env.REACT_APP_BACKEND_URL) {
    return <BackendURL />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {showNavFooter && <Navbar />}
      <main className="flex-grow-1">
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Demo />} path="/demo" />
          <Route element={<Single />} path="/single/:theid" />
          <Route element={<Hoteles />} path="/hoteles" />
          <Route element={<Branches />} path="/ListaBranches" />
          <Route element={<ListaRoom />} path="/listaRoom" />
          <Route element={<Maintenance />} path="/listaMaintenance" />
          <Route element={<HouseKeeper />} path="/houseKeeper" />
          <Route element={<ProtectedPrivateHouseKeeper><PrivateHouseKeeper /></ProtectedPrivateHouseKeeper>}path="/privateHouseKeeper"/>
          <Route element={<HouseKeeperTask />} path="/HouseKeeperTask" />
          <Route element={<PrivateHotel />} path="/privateHotel" />
          <Route element={<LoginUnico />} path="/login" />
          <Route element={<SignupHotel />} path="/signup" />
          <Route element={<MaintenanceTask />} path="/maintenanceTask" />
          <Route element={<ProtectedPrivateMaintenance><PrivateMaintenance /></ProtectedPrivateMaintenance>}path="/privateMaintenance"/>
          <Route element={<TaskFilterView />} path="/task-filter" />
          <Route element={<TaskFilterView2 />} path="/task-filter-housekeeper" />
          <Route element={<HousekeeperWorkLog />} path="/housekeeperWorkLog" />
          <Route element={<MaintenanceWorkLog />} path="/maintenanceWorkLog" />
          <Route element={<PrivateRoute roles={["gobernanta"]}><PrivateGobernanta /></PrivateRoute>} path="/private/gobernanta"/>
          <Route element={<PrivateRoute roles={["recepcion"]}><PrivateRecepcion /></PrivateRoute>} path="/private/recepcion" />
          <Route element={<PrivateRoute roles={["jefe de mantenimiento"]}><PrivateJefeMantenimiento /></PrivateRoute>} path="/private/jefe-mantenimiento"/>
          <Route element={<h1>Not found!</h1>} path="*" />
        </Routes>
      </main>
      {showNavFooter && <Footer />}
    </div>
  );
};

export default injectContext(Layout);
