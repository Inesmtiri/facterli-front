import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaBoxes, FaTrash } from "react-icons/fa";
import axios from "axios";

const ServiceList = ({ services, onDelete }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmez-vous la suppression de ce service ?")) return;

    try {
      await axios.delete(`https://facterli-server-4.onrender.com/api/services/${id}`);
      onDelete(id); // mise à jour dans le parent
    } catch (error) {
      console.error("❌ Erreur lors de la suppression du service :", error);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
      <h6 className="mb-3 fst-italic">• Mes services :</h6>

      {services.length > 0 ? services.map((service, index) => (
        <div
          key={service._id || service.id}
          className={`d-flex justify-content-between align-items-center border rounded p-3 mb-2 ${index % 2 === 0 ? "bg-light" : ""}`}
        >
          <div className="d-flex align-items-center">
            <FaBoxes className="me-2" />
            <span>{service.nom}</span>
          </div>

          <Button
            variant="link"
            className="text-dark p-0"
            onClick={() => handleDelete(service._id || service.id)}
          >
            <FaTrash />
          </Button>
        </div>
      )) : (
        <p className="text-center text-muted">Aucun service disponible.</p>
      )}
    </Card>
  );
};

export default ServiceList;
