import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarClient from "../../Clients/Components/SidebarClient";
import Navbar from "./Navbar";
import { Modal, Button } from "react-bootstrap";

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const CurrentSidebar = user?.role === "client" ? SidebarClient : Sidebar;

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <CurrentSidebar />

      {/* Contenu principal */}
      <div
        style={{
          marginLeft: "230px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Navbar onLogout={() => setShowLogout(true)} />

        <div style={{ flex: 1, padding: "20px", marginTop: "60px", backgroundColor: "#fff" }}>
          <Outlet />
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      <Modal
  show={showLogout}
  onHide={() => setShowLogout(false)} // pour activer la croix
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>
      <i className="bi bi-box-arrow-right fs-4 text-danger"></i> {/* icône seule */}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body className="text-muted text-center">
    Vous êtes sur le point de vous déconnecter. Souhaitez-vous continuer ?
  </Modal.Body>

  <Modal.Footer className="d-flex justify-content-center border-0 pb-4 pt-0 gap-3">
    <Button
      onClick={() => setShowLogout(false)}
      className="rounded-pill fw-bold px-4 py-2"
      style={{
        border: "2px solid #0d6efd",
        color: "#0d6efd",
        backgroundColor: "#e7f1ff",
        minWidth: "140px",
      }}
    >
      Annuler
    </Button>
    <Button
      onClick={handleLogout}
      className="rounded-pill px-4 py-2 fw-bold text-white"
      style={{ backgroundColor: "#dc3545", borderColor: "#dc3545", minWidth: "130px" }}
    >
      Confirmer
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default Layout;
