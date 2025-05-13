import React, { useRef, useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaSearch,
  FaUserEdit,
  FaUser,
  FaTachometerAlt,
  FaUserTie,
  FaFileAlt,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBox,
} from "react-icons/fa";

import EditAdressePasswordModal from "./EditProfileModal";
import EditClientProfileModal from "../../Clients/Components/EditClientProfileModal";
import { SearchContext } from "../../context/SearchContext"; // 📌 adapte ce chemin si besoin

const Navbar = ({ onLogout }) => {
  
  const { searchTerm, setSearchTerm } = useContext(SearchContext); // 🔍 global search
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState({
    prenom: "",
    nom: "",
    email: "",
    _id: "",
    role: "",
  });

  const location = useLocation();
  const menuRef = useRef();

  const routeToModule = {
    "/dashboard": { name: "Dashboard", icon: <FaTachometerAlt /> },
    "/client": { name: "Client", icon: <FaUserTie /> },
    "/devis": { name: "Devis", icon: <FaFileAlt /> },
    "/factures": { name: "Facture", icon: <FaFileAlt /> },
    "/paiement": { name: "Paiement", icon: <FaMoneyBillWave /> },
    "/depenses": { name: "Depenses", icon: <FaShoppingCart /> },
    "/produits": { name: "Produit et services", icon: <FaBox /> },
    "/projets": { name: "Projet", icon: <FaProjectDiagram /> },

    // Routes côté client
    "/client/dashboard": { name: "Dashboard", icon: <FaTachometerAlt /> },
    "/client/mes-devis": { name: "Mes Devis", icon: <FaFileAlt /> },
    "/client/mes-factures": { name: "Mes Factures", icon: <FaFileAlt /> },
  };

  const activeModule = routeToModule[location.pathname] || { name: "", icon: null };

  const getInitials = () => {
    const f = user.prenom?.[0]?.toUpperCase() || "";
    const l = user.nom?.[0]?.toUpperCase() || "";
    return f + l;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleProfileClick = () => {
    setShowProfileModal(true);
    setMenuOpen(false);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setShowProfileModal(false);
  };

  return (
    <>
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm"
        style={{
          position: "fixed",
          left: "230px",
          top: 0,
          right: 0,
          zIndex: 9999,
          height: "60px",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* 🧠 Module actif */}
        <div className="d-flex align-items-center gap-2 text-dark">
          {activeModule?.icon}
          <span className="fst-italic fw-semibold">{activeModule?.name}</span>
        </div>

        {/* 🔍 Recherche + Profil */}
        <div className="d-flex align-items-center gap-3">
          <div className="input-group" style={{ width: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span
              className="input-group-text"
              style={{ cursor: "default", backgroundColor: "#ffffff" }}
            >
              <FaSearch />
            </span>
          </div>

          <div className="position-relative" ref={menuRef}>
            <div
              className="rounded-circle bg-primary text-white fw-bold d-flex justify-content-center align-items-center"
              style={{
                width: 38,
                height: 38,
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
              onClick={toggleMenu}
              title="Profil"
            >
              {user.prenom && user.nom ? getInitials() : <FaUser />}
            </div>

            {menuOpen && (
              <div
                className="position-absolute border rounded-2 bg-white shadow-sm"
                style={{
                  top: "120%",
                  right: 0,
                  width: "200px",
                  zIndex: 1000,
                }}
              >
                <div className="px-3 pt-3 pb-2 border-bottom fw-bold text-dark small">
                  Compte
                </div>
                <button
                  className="w-100 text-start border-0 bg-transparent px-3 py-2 d-flex align-items-center gap-2 hoverable"
                  onClick={handleProfileClick}
                >
                  <FaUserEdit />
                  Modifier le profil
                </button>
                <button
                  className="w-100 text-start border-0 bg-transparent px-3 py-2 d-flex align-items-center gap-2 hoverable text-danger"
                  onClick={onLogout}
                >
                  <FaSignOutAlt />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .hoverable:hover {
            background-color: #f5f5f5;
            cursor: pointer;
          }
        `}</style>
      </nav>

      {/* 🔄 Modal admin ou client selon rôle */}
      {user.role === "admin" ? (
        <EditAdressePasswordModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onSave={handleUserUpdate}
        />
      ) : (
        <EditClientProfileModal
          show={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onSave={handleUserUpdate}
        />
      )}
    </>
  );
};

export default Navbar;
