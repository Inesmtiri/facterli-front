import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { SearchContext } from "../../context/SearchContext";

const API_URL = "https://facterli-server-4.onrender.com/api/paiements";

const Paiement = () => {
  const { searchTerm } = useContext(SearchContext);
  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const [factures, setFactures] = useState([]);
  const [formData, setFormData] = useState({
    facture: "",
    datePaiement: new Date().toISOString().split("T")[0],
    typePaiement: "en ligne",
    montant: "",
  });
  const [editId, setEditId] = useState(null);
  const [montantRestant, setMontantRestant] = useState(0);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchPaiements();
    fetchFactures();
  }, []);

  const fetchPaiements = async () => {
    try {
      const res = await axios.get(API_URL);
      setPaiements(res.data);
    } catch (err) {
      console.error("Erreur chargement paiements :", err);
    }
  };

  const fetchFactures = async () => {
    try {
      const res = await axios.get("https://facterli-server-4.onrender.com/api/factures");
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur chargement factures :", err);
    }
  };

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = paiements.filter((p) => {
      const client = p.facture?.client;
      const nomClient =
        typeof client === "object"
          ? `${client.nom} ${client.prenom} ${client.societe || ""}`
          : client;
      return `${p.facture?.numeroFacture || ""} ${nomClient || ""} ${p.datePaiement || ""}`
        .toLowerCase()
        .includes(term);
    });
    setFilteredPaiements(filtered);
  }, [searchTerm, paiements]);

  useEffect(() => {
    if (query.length > 0) {
      const results = factures.filter((f) =>
        `${f.numeroFacture} ${f.nomEntreprise} ${f.total}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query, factures]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "facture") {
      const selected = factures.find((f) => f._id === value);
      setMontantRestant(selected ? selected.montantRestant : 0);
    }
  };

  const handleAddOrEditPaiement = async (e) => {
    e.preventDefault();
    if (!formData.facture || !formData.montant) {
      alert("Veuillez remplir les champs obligatoires !");
      return;
    }

    if (parseFloat(formData.montant) > montantRestant) {
      alert("❌ Le montant payé dépasse le montant restant !");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      alert("✅ Paiement enregistré !");
      fetchPaiements();
      fetchFactures();
      resetForm();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce paiement ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPaiements();
        if (editId === id) resetForm();
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  const handleEdit = (paiement) => {
    const factureObject = factures.find(f => f._id === (paiement.facture?._id || paiement.facture));
    setEditId(paiement._id);
    setFormData({
      facture: paiement.facture?._id || paiement.facture,
      datePaiement: paiement.datePaiement?.slice(0, 10) || new Date().toISOString().split("T")[0],
      typePaiement: paiement.typePaiement || "en ligne",
      montant: paiement.montant,
    });
    setQuery(`${factureObject?.numeroFacture} - ${factureObject?.nomEntreprise} - ${factureObject?.total} TND`);
    setMontantRestant(factureObject?.montantRestant || 0);
  };

  const resetForm = () => {
    setFormData({
      facture: "",
      datePaiement: new Date().toISOString().split("T")[0],
      typePaiement: "en ligne",
      montant: "",
    });
    setQuery("");
    setEditId(null);
    setMontantRestant(0);
  };

  return (
    <div className="container mt-4">
      <div className="shadow-lg p-4 mb-4 bg-white border-0 rounded-4 mx-auto" style={{ maxWidth: "1200px" }}>
        <h5 className="fw-semibold text-primary mb-4">
          <i className="bi bi-credit-card me-2"></i>
          {editId ? "✏️ Modifier le paiement" : "➕ Ajouter un paiement"}
        </h5>

        <form onSubmit={handleAddOrEditPaiement}>
          <div className="row g-3 align-items-end">
            <div className="col-md-2 position-relative">
              <label className="form-label">Facture</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher une facture"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
              {suggestions.length > 0 && (
                <ul className="list-group position-absolute w-100 z-3">
                  {suggestions.map((facture) => (
                    <li
                      key={facture._id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setQuery(`${facture.numeroFacture} - ${facture.nomEntreprise} - ${facture.total} TND`);
                        setFormData({ ...formData, facture: facture._id });
                        setMontantRestant(facture.montantRestant);
                        setSuggestions([]);
                      }}
                    >
                      {facture.numeroFacture} - {facture.nomEntreprise} - {facture.total} TND
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="datePaiement"
                value={formData.datePaiement}
                onChange={handleChange}
                className="form-control"
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Type</label>
              <select
                name="typePaiement"
                value={formData.typePaiement}
                onChange={handleChange}
                className="form-select"
              >
                <option value="en ligne">En ligne</option>
                <option value="hors ligne">Hors ligne</option>
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Montant</label>
              <input
                type="number"
                name="montant"
                value={formData.montant}
                onChange={handleChange}
                className="form-control"
                placeholder="0"
                required
              />
              {montantRestant > 0 && (
                <div className="text-muted small mt-1">
                  💡 Reste à payer : <strong>{montantRestant.toFixed(3)} TND</strong>
                </div>
              )}
            </div>

            <div className="col-md-2">
  <button
    type="submit"
    className={`btn ${editId ? "btn-warning text-white" : "btn-vert"} shadow-sm rounded-pill fw-bold px-3 py-2 w-100`}
  >
    <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
    {editId ? "Modifier" : "Ajouter"}
  </button>
</div>

{editId && (
  <div className="col-md-2">
    <button
      type="button"
      className="btn btn-outline-primary shadow-sm rounded-pill fw-bold px-3 py-2 w-100"
      onClick={resetForm}
    >
      Annuler
    </button>
  </div>
)}

            
          </div>
        </form>
      </div>

      <div className="shadow-lg p-4 bg-white border-0 rounded-4 mx-auto" style={{ maxWidth: "1200px" }}>
        <h5 className="fw-semibold text-primary mb-4">
          <i className="bi bi-list-check me-2"></i> Liste des paiements
        </h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th>Facture</th>
                <th>Date</th>
                <th>Type</th>
                <th>Total</th>
                <th>Payé</th>
                <th>Restant</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPaiements.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted">Aucun paiement trouvé.</td>
                </tr>
              ) : (
                filteredPaiements.map((p) => (
                  <tr key={p._id}>
                    <td>{p.facture?.numeroFacture || "–"}</td>
                    <td>{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString() : "-"}</td>
                    <td>{p.typePaiement || "-"}</td>
                    <td>{p.facture?.total || 0} TND</td>
                    <td>{p.facture?.montantPaye || 0} TND</td>
                    <td>{p.facture?.montantRestant || 0} TND</td>
                    <td>{p.montant} TND</td>
                    <td>
                    <span
  className="badge px-3 py-2 rounded-pill"
  style={{
    backgroundColor:
      p.facture?.statut === "payé"
        ? "#D8F3DC"            // vert pastel
        : p.facture?.statut === "partiellement payé"
        ? "#FFF3CD"            // jaune pastel
        : "#F8D7DA",           // rouge pastel
    color:
      p.facture?.statut === "payé"
        ? "#155724"
        : p.facture?.statut === "partiellement payé"
        ? "#856404"
        : "#721c24",
  }}
>
  {p.facture?.statut || "–"}
</span>

                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Paiement;