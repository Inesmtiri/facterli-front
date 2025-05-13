import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Card,
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen, FaExchangeAlt } from "react-icons/fa";
import DevisForm from "../components/Devis/DevisForm";
import FactureForm from "../components/Facture/FactureForm";
import { SearchContext } from "../../context/SearchContext";

const DevisPage = () => {
  const { searchTerm } = useContext(SearchContext);
  const [devisList, setDevisList] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [devisToEdit, setDevisToEdit] = useState(null);
  const [produitsServices, setProduitsServices] = useState([]);
  const [convertData, setConvertData] = useState(null);
  const [showFactureForm, setShowFactureForm] = useState(false);

  useEffect(() => {
    fetchDevis();
    fetchProduitsServices();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = devisList.filter((devis) => {
      const clientNom = typeof devis.client === "object"
        ? `${devis.client.nom} ${devis.client.prenom} ${devis.client.societe || ""}`
        : devis.client;
      return `${clientNom} ${devis.numeroDevis}`.toLowerCase().includes(term);
    });
    setFilteredDevis(result);
  }, [searchTerm, devisList]);

  const fetchDevis = async () => {
    try {
      const res = await axios.get("/api/devis");
      const triés = [...res.data].sort((a, b) => parseInt(b.numeroDevis) - parseInt(a.numeroDevis));
      setDevisList(triés);
    } catch (err) {
      console.error("Erreur chargement devis:", err.message);
    }
  };

  const fetchProduitsServices = async () => {
    const [produitsRes, servicesRes] = await Promise.all([
      axios.get("/api/produits"),
      axios.get("/api/services"),
    ]);
    const produits = produitsRes.data.map((p) => ({ id: p._id, nom: p.reference, prix: p.prixVente, type: "produit" }));
    const services = servicesRes.data.map((s) => ({ id: s._id, nom: s.nom, prix: s.tarif, type: "service" }));
    setProduitsServices([...produits, ...services]);
  };

  const updateDevis = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/devis/${id}`, updatedData);
      setDevisList((prev) => prev.map((d) => (d._id === id ? res.data : d)));
    } catch (err) {
      console.error("Erreur mise à jour devis:", err.message);
    }
  };

  const handleAddDevis = async (devis) => {
    try {
      if (devisToEdit) {
        await updateDevis(devisToEdit._id, devis);
      } else {
        setDevisList((prev) => [...prev, devis]);
      }
      setShowForm(false);
      setDevisToEdit(null);
    } catch (err) {
      console.error("Erreur enregistrement devis:", err.message);
    }
  };

  const handleDeleteDevis = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      try {
        await axios.delete(`/api/devis/${id}`);
        setDevisList((prev) => prev.filter((d) => d._id !== id));
      } catch (err) {
        console.error("Erreur suppression devis:", err.message);
      }
    }
  };

  const handleEditDevis = (devis) => {
    const lignesAvecDesignation = devis.lignes.map((ligne) => {
      const item = produitsServices.find((p) => p.id === ligne.itemId && p.type === ligne.type);
      return { ...ligne, designation: item ? `${item.nom} - ${item.prix}` : ligne.designation };
    });
    setDevisToEdit({ ...devis, lignes: lignesAvecDesignation, logo: devis.logo || "", nomEntreprise: devis.nomEntreprise || "", telephone: devis.telephone || "" });
    setShowForm(true);
  };

  const handleConvertToFacture = async (devis) => {
    const clientId = devis.clientId;
    let clientNom = "";
    if (!clientId) return;
    try {
      const res = await axios.get(`/api/clients/${clientId}`);
      const c = res.data;
      clientNom = `${c.nom || ""} ${c.prenom || ""} - ${c.societe || ""}`.trim();
    } catch (err) {
      console.warn("Impossible de charger le client:", err);
    }
    const factureData = {
      client: clientId,
      clientInput: clientNom,
      lignes: devis.lignes,
      date: new Date().toISOString().slice(0, 10),
      reference: devis.reference,
      remise: devis.remise,
      tvaRate: devis.tvaRate,
      nomEntreprise: devis.nomEntreprise,
      telephone: devis.telephone,
      logo: devis.logo || "",
      devisId: devis._id,
    };
    setConvertData(factureData);
    setShowFactureForm(true);
  };
  const handleViewDevis = (devis) => {
    const clientNom = devis.client?.nom || "";
    const clientPrenom = devis.client?.prenom || "";
    const societe = devis.client?.societe || "";
    const logoURL = devis.logo
      ? typeof devis.logo === "string"
        ? devis.logo.startsWith("data:")
          ? devis.logo
          : `/uploads/${devis.logo}`
        : URL.createObjectURL(devis.logo)
      : "";
  
    const remise = devis.remise || 0;
    const subtotal = devis.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = devis.tax || 0;
    const total = devis.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;
  
    const html = `
      <html>
        <head>
          <title>Devis ${devis.numeroDevis}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #2f3e4d;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 40px;
            }
            .client-info img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              object-fit: cover;
              margin-bottom: 10px;
            }
            .client-info, .company-info {
              font-size: 16px;
              line-height: 1.5;
            }
            .section-title {
              font-size: 14px;
              color: #6b7280;
              font-weight: 600;
              margin-bottom: 4px;
            }
            .info-blocks {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 15px;
            }
            th {
              background-color: #f8f9fa;
              padding: 12px;
              text-align: center;
              color: #333;
              border-bottom: 2px solid #dee2e6;
            }
            td {
              padding: 10px;
              text-align: center;
              border-bottom: 1px solid #dee2e6;
            }
            .totals {
              margin-top: 40px;
              text-align: right;
              font-size: 16px;
              color: #2f3e4d;
            }
            .totals p {
              margin: 5px 0;
            }
            .total-amount {
              font-size: 20px;
              font-weight: bold;
              color: #0056b3;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 13px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="client-info">
              ${logoURL ? `<img src="${logoURL}" alt="Logo Client">` : ""}
              <div class="section-title">Client</div>
              ${clientNom} ${clientPrenom}<br/>
              ${societe}
            </div>
            <div class="company-info" style="text-align: right;">
              <strong>Ganesh Coding</strong><br/>
              25140235<br/>
              Beb bhar
            </div>
          </div>
  
          <div class="info-blocks">
            <div>
              <div class="section-title">Date</div>
              ${devis.date?.slice(0, 10) || "-"}
            </div>
            <div>
              <div class="section-title">N° Devis</div>
              ${devis.numeroDevis}
            </div>
            <div>
              <div class="section-title">Référence</div>
              ${devis.reference || "-"}
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Total ligne</th>
              </tr>
            </thead>
            <tbody>
              ${devis.lignes.map(l => `
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
            <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
            <p><strong>Remise (${remise}%):</strong> ${remiseMontant.toFixed(3)} TND</p>
            <p><strong>TVA (${tvaRate}%):</strong> ${tax.toFixed(3)} TND</p>
            <p class="total-amount"><strong>Total :</strong> ${total.toFixed(3)} TND</p>
          </div>
  
          <div class="footer">Merci pour votre confiance – Facterli</div>
  
          <script>window.print()</script>
        </body>
      </html>
    `;
  
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
  };

  return (
    <Container className="mt-4">
      {showForm ? (
        <DevisForm
          onAddDevis={handleAddDevis}
          onCancel={() => {
            setShowForm(false);
            setDevisToEdit(null);
          }}
          editData={devisToEdit}
          produitsServices={produitsServices}
        />
      ) : (
        <>
          <Row className="mb-4 justify-content-end">
  <Col xs="auto">
    <Button
      onClick={() => {
        setShowForm(true);
      }}
      className="btn btn-vert fw-bold shadow-sm rounded-pill px-4 py-2"
      style={{ minWidth: "130px" }}
    >
      Ajouter
    </Button>
  </Col>



          </Row>

          <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
            <h5 className="mb-4 fw-semibold text-primary">Liste des devis</h5>
            {filteredDevis.length > 0 ? (
              <Table responsive className="align-middle text-center table-striped">
                <thead className="bg-light text-muted">
                  <tr>
                    <th className="text-start">Client / N°</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevis.map((devis) => (
                    <tr key={devis._id} className="align-middle">
                      <td className="text-start">
                        <div className="fw-semibold">
                          {typeof devis.client === "object" ? `${devis.client.nom} ${devis.client.prenom}` : devis.client}
                        </div>
                        <small className="text-muted">{devis.numeroDevis}</small>
                      </td>
                      <td>{devis.date?.slice(0, 10)}</td>
                      <td>{devis.total?.toFixed(3)} TND</td>
                      <td>
                      <span
  className="px-1 py-1 text-capitalize rounded-pill fw-semibold"
  style={{
    backgroundColor:
      devis.statut === "accepté"
        ? "#D8F3DC"
        : devis.statut === "refusé"
        ? "#F8D7DA"
        : "#FFF3CD",
    color:
      devis.statut === "accepté"
        ? "#155724"
        : devis.statut === "refusé"
        ? "#721c24"
        : "#856404",
  }}
>
  {devis.statut}
</span>




                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Button variant="outline-primary" size="sm" onClick={() => handleViewDevis(devis)}><FaFileAlt /></Button>
                          <Button variant="outline-success" size="sm" onClick={() => handleEditDevis(devis)}><FaPen /></Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDevis(devis._id)}><FaTrash /></Button>
                          {devis.statut === "accepté" && (
                            <Button variant="outline-warning" size="sm" onClick={() => handleConvertToFacture(devis)} title="Convertir en facture">
                              <FaExchangeAlt />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center text-muted">Aucun devis trouvé.</p>
            )}
          </Card>
        </>
      )}

      {showFactureForm && (
        <FactureForm
          editData={convertData}
          onAddFacture={() => {
            setShowFactureForm(false);
            setConvertData(null);
          }}
          onCancel={() => {
            setShowFactureForm(false);
            setConvertData(null);
          }}
        />
      )}
    </Container>
  );
};

export default DevisPage;
