import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaTrash, FaBox, FaEdit } from "react-icons/fa";
import axios from "axios";

const ProduitList = ({ produits, onDelete, onEdit }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      await axios.delete(`https://facterli-server-4.onrender.com/api/produits/${id}`);
      onDelete(id);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression du produit.");
    }
  };

  return (
    <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
      <h5 className="mb-3 fst-italic">• Mes produits :</h5>

      {produits.length === 0 ? (
        <p className="text-center text-muted">
          Aucun produit ajouté pour l'instant.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {produits.map((produit) => (
            <div
              key={produit._id || produit.id}
              className="d-flex justify-content-between align-items-center border rounded p-3 bg-light"
            >
              {/* Partie gauche */}
              <div className="d-flex align-items-center gap-3">
                <FaBox size={20} color="#23BD15" />
                <div>
                  <div className="fw-bold">
                    {produit.reference || "Sans référence"}
                  </div>
                  <div className="text-muted small">
                    Catégorie : {produit.categorie || "Non spécifiée"}
                  </div>
                </div>
              </div>

              {/* Partie droite */}
              <div className="d-flex align-items-center gap-3">
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      produit.statut === "rupture" ? "#E74C3C" : "#F39C12",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "0.8rem",
                    padding: "5px 10px",
                    borderRadius: "12px"
                  }}
                >
                  {produit.statut === "rupture" ? "Rupture" : "En stock"}
                </span>

                {/* 🖊️ Modifier */}
                <Button
                  variant="link"
                  className="text-primary p-0"
                  onClick={() => onEdit(produit)}
                  title="Modifier ce produit"
                >
                  <FaEdit size={18} />
                </Button>

                {/* 🗑️ Supprimer */}
                <Button
                  variant="link"
                  className="text-dark p-0"
                  onClick={() => handleDelete(produit._id || produit.id)}
                  title="Supprimer ce produit"
                >
                  <FaTrash size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProduitList;
