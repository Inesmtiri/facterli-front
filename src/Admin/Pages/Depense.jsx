import React, { useEffect, useState, useContext } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import DepenseForm from "../components/DepenceForm";
import axios from "axios";
import { SearchContext } from "../../context/SearchContext";
import { Card, Button, Row, Col, Table } from "react-bootstrap";

const DepensePage = () => {
  const { searchTerm } = useContext(SearchContext);
  const [depenses, setDepenses] = useState([]);
  const [filteredDepenses, setFilteredDepenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchDepenses = async () => {
    try {
      const res = await axios.get("/api/depenses");
      setDepenses(res.data);
    } catch (err) {
      console.error("Erreur chargement des dépenses :", err);
    }
  };

  useEffect(() => {
    fetchDepenses();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = depenses.filter((dep) =>
      `${dep.categorie} ${dep.description} ${dep.commercant} ${dep.montant}`
        .toLowerCase()
        .includes(term)
    );
    setFilteredDepenses(result);
  }, [searchTerm, depenses]);

  const handleSaveDepense = async (depense) => {
    try {
      const cleanedDepense = {
        categorie: depense.categorie,
        montant: parseFloat(depense.montant),
        date: depense.date,
        description: depense.description,
        commercant: depense.commercant,
        image: depense.fichierRecu || "",
      };

      if (editData) {
        const res = await axios.put(`/api/depenses/${editData._id}`, cleanedDepense);
        setDepenses(depenses.map((d) => (d._id === editData._id ? res.data : d)));
      } else {
        const res = await axios.post("/api/depenses", cleanedDepense);
        setDepenses([res.data, ...depenses]);
      }

      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      if (err.response) {
        console.error("Message backend :", err.response.data);
      }
    }
  };

  const handleEditDepense = (depense) => {
    setEditData(depense);
    setShowForm(true);
  };

  const handleDeleteDepense = async (id) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      try {
        await axios.delete(`/api/depenses/${id}`);
        setDepenses(depenses.filter((dep) => dep._id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  return (
    <div className="container mt-4">
      {!showForm && (
        <Row className="mb-4 justify-content-end">
          <Col xs="auto">
          <Button
  className="fw-bold shadow-sm rounded-pill px-4 py-2"
  onClick={() => {
    setEditData(null);
    setShowForm(true);
  }}
  style={{ backgroundColor: "#00B507", borderColor: "#00B507", color: "#fff" }}
>
  Nouvelle dépense
</Button>

          </Col>
        </Row>
      )}

      {showForm && (
        <DepenseForm
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSaveDepense}
          editData={editData}
        />
      )}

      {!showForm && (
        <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
          <h5 className="mb-4 fw-semibold text-primary">Liste des dépenses</h5>
          {filteredDepenses.length === 0 ? (
            <p className="text-center text-muted">Aucune dépense trouvée.</p>
          ) : (
            <Table responsive className="align-middle text-center table-striped">
              <thead className="bg-light text-muted">
                <tr>
                  <th className="text-start">Catégorie</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepenses.map((depense) => (
                  <tr key={depense._id}>
                    <td className="text-start">
                      <div className="fw-semibold">{depense.categorie || "Sans catégorie"}</div>
                      <div className="text-muted small fst-italic">{depense.description || "Aucune description"}</div>
                    </td>
                    <td>{new Date(depense.date).toLocaleDateString()}</td>
                    <td>{parseFloat(depense.montant).toFixed(3)} TND</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Modifier"
                          onClick={() => handleEditDepense(depense)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Supprimer"
                          onClick={() => handleDeleteDepense(depense._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </div>
  );
};

export default DepensePage;