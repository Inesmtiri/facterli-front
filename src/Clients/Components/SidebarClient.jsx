import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaFileAlt, FaBars } from "react-icons/fa";
import "@fontsource/marhey/600.css";

const SidebarClient = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/client/dashboard" },
    { name: "Mes Devis", icon: <FaFileAlt />, path: "/client/mes-devis" },
    { name: "Mes Factures", icon: <FaFileAlt />, path: "/client/mes-factures" },
  ];

  return (
    <div
      className={`d-flex flex-column justify-content-between text-white position-fixed ${collapsed ? "px-2" : "p-3"}`}
      style={{
        width: collapsed ? "80px" : "230px",
        height: "100vh",
        backgroundColor: "#4dabf7",
        transition: "width 0.3s",
        overflowY: "auto",
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      {/* ✅ TOGGLE BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {!collapsed && (
          <h4
            style={{
              fontSize: "1.8rem",
              fontFamily: "'Marhey', sans-serif",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "1px",
            }}
          >
            Facterli
          </h4>
        )}
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setCollapsed(!collapsed)}
          style={{ borderRadius: "50%", width: "36px", height: "36px" }}
        >
          <FaBars />
        </button>
      </div>

      {/* ✅ MENU ITEMS */}
      <ul className="nav flex-column flex-grow-1">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center py-2 px-3 my-1 ${
                  isActive ? "bg-white text-primary fw-bold rounded" : "text-white"
                }`
              }
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {!collapsed && <span className="ms-2">{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* ✅ Footer optionnel */}
      {!collapsed && (
        <div className="mt-auto text-center small">
          <span>&copy; 2025 Facterli</span>
        </div>
      )}
    </div>
  );
};

export default SidebarClient;
