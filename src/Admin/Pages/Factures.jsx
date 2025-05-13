import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import FactureForm from "../components/Facture/FactureForm";
import { SearchContext } from "../../context/SearchContext";

const FacturePage = () => {
  const { searchTerm } = useContext(SearchContext);
  const [factureList, setFactureList] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturesRes, paiementsRes] = await Promise.all([
          axios.get("/api/factures"),
          axios.get("/api/paiements"),
        ]);

        const paiements = paiementsRes.data;

        const facturesAvecStatut = facturesRes.data.map((facture) => {
          const paiementsFacture = paiements.filter(
            (p) => p.facture === facture._id
          );
          const montantPayé = paiementsFacture.reduce((s, p) => s + p.montant, 0);
          let statut = "non payé";
          if (montantPayé >= facture.total) statut = "payé";
          else if (montantPayé > 0) statut = "partiellement payé";

          return { ...facture, statut };
        });

        const triées = [...facturesAvecStatut].sort((a, b) => {
          const numA = parseInt(a.numeroFacture) || 0;
          const numB = parseInt(b.numeroFacture) || 0;
          return numB - numA;
        });

        setFactureList(triées);
      } catch (err) {
        console.error("❌ Erreur chargement données :", err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = factureList.filter((facture) => {
      // Vérifiez si 'facture.client' est un objet et existe avant d'y accéder
      const nomClient = facture.client && typeof facture.client === "object"
        ? `${facture.client.nom || ""} ${facture.client.prenom || ""} ${facture.client.societe || ""}`
        : facture.client;
  
      return (
        `${nomClient} ${facture.numeroFacture} ${facture.reference}`
          .toLowerCase()
          .includes(term)
      );
    });
  
    setFilteredFactures(result);
  }, [searchTerm, factureList]);
  

  const handleAddFacture = async (facture, alreadyCreated = false) => {
    try {
      if (alreadyCreated) {
        setFactureList((prev) => [facture, ...prev]);
      } else if (editData) {
        const res = await axios.put(`/api/factures/${editData._id}`, facture);
        setFactureList((prev) =>
          prev.map((f) => (f._id === editData._id ? res.data : f))
        );
      } else {
        const res = await axios.post("/api/factures", facture);
        setFactureList((prev) => [res.data, ...prev]);
      }

      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("❌ Erreur ajout/modif facture :", err.message);
    }
  };

  const handleDeleteFacture = async (id) => {
    if (window.confirm("Supprimer cette facture ?")) {
      try {
        await axios.delete(`/api/factures/${id}`);
        setFactureList((prev) => prev.filter((f) => f._id !== id));
      } catch (err) {
        console.error("Erreur suppression facture :", err.message);
      }
    }
  };

  const handleEdit = (facture) => {
    const lignesFormatees = facture.lignes.map((l) => ({
      itemId: l.itemId,
      type: l.type,
      designation: l.designation,
      quantite: l.quantite,
      prixUnitaire: l.prixUnitaire,
      inputValue: `${l.designation} - ${l.prixUnitaire}`
    }));

    const clientInput =
      typeof facture.client === "object"
        ? `${facture.client.nom} ${facture.client.prenom} - ${facture.client.societe || ""}`
        : "";

    const clientId =
      typeof facture.client === "object"
        ? facture.client._id
        : facture.client;

    setEditData({
      ...facture,
      client: clientId,
      clientInput,
      lignes: lignesFormatees,
      numeroFacture: facture.numeroFacture || "",
      logo: facture.logo || null
    });

    setShowForm(true);
  };

  const handleViewFacture = (facture) => {
    const clientNom = facture.client?.nom || facture.client?.societe || facture.client;
    const logoURL = facture.logo
      ? typeof facture.logo === "string"
        ? facture.logo.startsWith("data:") ? facture.logo : `/uploads/${facture.logo}`
        : URL.createObjectURL(facture.logo)
      : "";

    const remise = facture.remise || 0;
    const subtotal = facture.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = facture.tax || 0;
    const total = facture.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;

    const html = `
      <html>
        <head>
          <title>Facture ${facture.numeroFacture}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #2f3e4d; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .client-info, .company-info { font-size: 16px; }
            .section-title { font-weight: 600; color: #888; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px; }
            th, td { padding: 10px; border-bottom: 1px solid #ccc; text-align: center; }
            .totals { margin-top: 40px; text-align: right; font-size: 16px; }
            .total-amount { font-size: 20px; font-weight: bold; color: #0056b3; }
            .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="client-info">
              ${logoURL ? `<img src="${logoURL}" alt="Logo" width="60" style="border-radius:6px;" /><br/>` : ""}
              <div class="section-title">Client</div>
              ${clientNom}<br/>${facture.nomEntreprise || ""}
            </div>
            <div class="company-info" style="text-align:right;">
              <strong>Ganesh Coding</strong><br/>
              25140235<br/>
              Beb bhar
            </div>
          </div>

          <div class="section-title">Détails</div>
          <div>
            Date : ${facture.date?.slice(0, 10)}<br/>
            Facture N° : ${facture.numeroFacture}<br/>
            Référence : ${facture.reference || "-"}
          </div>

          <table>
            <thead>
              <tr><th>Désignation</th><th>PU</th><th>Qté</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${facture.lignes.map(l => `
                <tr>
                  <td style="text-align:left;">${l.designation}</td>
                  <td>${l.prixUnitaire.toFixed(3)} TND</td>
                  <td>${l.quantite}</td>
                  <td>${(l.quantite * l.prixUnitaire).toFixed(3)} TND</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p>Sous-total : ${subtotal.toFixed(3)} TND</p>
            <p>Remise (${remise}%) : ${remiseMontant.toFixed(3)} TND</p>
            <p>TVA (${tvaRate}%) : ${tax.toFixed(3)} TND</p>
            <p class="total-amount">Total : ${total.toFixed(3)} TND</p>
          </div>

          <div class="footer">Merci pour votre confiance – Facterli</div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <Container className="mt-4">
      {showForm ? (
        <FactureForm
          onAddFacture={handleAddFacture}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
        />
      ) : (
        <>
          <Row className="mb-4 justify-content-end">
          <Col xs="auto">
  <Button
    onClick={() => {
      setShowForm(true);
      setEditData(null);
    }}
    className="fw-bold shadow-sm rounded-pill px-4 py-2"
    style={{ backgroundColor: "#23BD15", borderColor: "#23BD15", color: "#fff", minWidth: "130px" }}
  >
    Ajouter
  </Button>
</Col>

          </Row>

          <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
            <h5 className="mb-4 fw-semibold text-primary">Liste des factures</h5>
            {filteredFactures.length > 0 ? (
              <Table responsive className="align-middle text-center table-striped">
                <thead className="bg-light text-muted">
                  <tr>
                    <th className="text-start">Client / N°</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFactures.map((facture) => (
                    <tr key={facture._id} className="align-middle">
                      <td className="text-start">
                        <div className="fw-semibold">
                          {facture.client?.nom || facture.client?.societe || "Client"}
                        </div>
                        <small className="text-muted">{facture.numeroFacture}</small>
                      </td>
                      <td>{facture.date?.slice(0, 10)}</td>
                      <td>{facture.total?.toFixed(3)} TND</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewFacture(facture)}>
                            <FaFileAlt />
                          </Button>
                          <Button variant="outline-success" size="sm" onClick={() => handleEdit(facture)}>
                            <FaPen />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFacture(facture._id)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted">Aucune facture trouvée.</p>
            )}
          </Card>
        </>
      )}
    </Container>
  );
};

export default FacturePage;
