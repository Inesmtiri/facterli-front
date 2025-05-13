import React from "react";
import { Button } from "react-bootstrap";

const ProduitServiceTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="d-flex justify-content-center mb-4">
      <div
        className="tabs-container d-flex"
        style={{
          backgroundColor: "#E6F0FA",
          padding: "5px",
          borderRadius: "25px",
          width: "320px",
        }}
      >
        {/* Onglet Produits */}
        <Button
          onClick={() => setActiveTab("produits")}
          style={{
            flex: 1,
            borderRadius: "25px",
            backgroundColor: activeTab === "produits" ? "#007bff" : "transparent",
            color: activeTab === "produits" ? "#fff" : "#007bff",
            border: "none",
            boxShadow: activeTab === "produits" ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none",
            fontWeight: "600",
            transition: "all 0.3s ease-in-out",
          }}
        >
          produits
        </Button>

        {/* Onglet Services */}
        <Button
          onClick={() => setActiveTab("services")}
          style={{
            flex: 1,
            borderRadius: "25px",
            backgroundColor: activeTab === "services" ? "#007bff" : "transparent",
            color: activeTab === "services" ? "#fff" : "#007bff",
            border: "none",
            boxShadow: activeTab === "services" ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none",
            fontWeight: "600",
            transition: "all 0.3s ease-in-out",
          }}
        >
          services
        </Button>
      </div>
    </div>
  );
};

export default ProduitServiceTabs;