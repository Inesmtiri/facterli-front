import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { SearchContext } from "../../context/SearchContext"; // 🔍 à adapter selon ton projet

export default function MesFacturesClient() {
  const { searchTerm } = useContext(SearchContext); // 🔍 champ de recherche global
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        let client = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("userData"));
        if (!client || (!client.id && !client._id)) {
          console.warn("❌ Aucun client connecté ou ID manquant dans localStorage");
          return;
        }

        const clientId = client.id || client._id;
        const res = await axios.get(`https://facterli-server-4.onrender.com/api/mes-factures/${clientId}`);
        setFactures(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des factures :", err);
      }
    };

    fetchFactures();
  }, []);

  const filteredFactures = factures.filter((facture) =>
    `${facture.reference} ${facture.total} ${facture.date} ${facture.statut}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleViewFacture = (facture) => {
    const clientNom = facture.client?.nom || facture.client?.societe || "Client";
    const logoURL = facture.logo
      ? typeof facture.logo === "string"
        ? `/uploads/${facture.logo}`
        : URL.createObjectURL(facture.logo)
      : "";

    const remise = facture.remise || 0;
    const subtotal = facture.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = facture.tax || 0;
    const total = facture.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;

    const factureHTML = `
      <html>
        <head>
          <title>Facture ${facture.numeroFacture}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; margin: 60px; color: #2f3e4d; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .header img { max-width: 140px; max-height: 100px; }
            .section-title { font-weight: 600; font-size: 14px; color: #6b7280; }
            .client-info, .facture-info { font-size: 16px; line-height: 1.6; }
            .info-blocks { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 30px; }
            th { background-color: #f2f4f6; color: #4b5563; padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .totals { margin-top: 40px; text-align: right; font-size: 16px; }
            .totals p { margin: 5px 0; }
            .total-amount { font-size: 20px; font-weight: bold; }
            .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="section-title">Client</div>
              <div class="client-info">
                ${clientNom}<br/>
                ${facture.nomEntreprise || ""}
              </div>
            </div>
            <div style="text-align:right;">
              <strong>Ganesh Coding</strong><br/>
              Beb bhar<br/>
              251403625
            </div>
            ${logoURL ? `<img src="${logoURL}" alt="Logo">` : ""}
          </div>

          <div class="info-blocks">
            <div class="facture-info"><div class="section-title">Date</div>${facture.date?.slice(0, 10) || "-"}</div>
            <div class="facture-info"><div class="section-title">N° Facture</div>${facture.numeroFacture}</div>
            <div class="facture-info"><div class="section-title">Référence</div>${facture.reference}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th style="text-align:center;">PU</th>
                <th style="text-align:center;">Quantité</th>
                <th style="text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${facture.lignes.map(l => `
                <tr>
                  <td>${l.designation}</td>
                  <td style="text-align:center;">${l.prixUnitaire.toFixed(3)} TND</td>
                  <td style="text-align:center;">${l.quantite}</td>
                  <td style="text-align:right;">${(l.prixUnitaire * l.quantite).toFixed(3)} TND</td>
                </tr>`).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
            <p><strong>Remise (${remise}%):</strong> ${remiseMontant.toFixed(3)} TND</p>
            <p><strong>TVA (${tvaRate}%):</strong> ${tax.toFixed(3)} TND</p>
            <p class="total-amount"><strong>Total :</strong> ${total.toFixed(3)} TND</p>
          </div>

          <div class="footer">Merci pour votre confiance – Facterli</div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(factureHTML);
    win.document.close();
    win.print();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📄 Mes factures reçues</h2>

      {filteredFactures.length === 0 ? (
        <div className="alert alert-info">
          Aucune facture trouvée.
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {filteredFactures.map((facture) => (
            <div
              key={facture._id}
              className="card text-center shadow-sm"
              style={{ width: "220px", borderRadius: "12px", cursor: "pointer" }}
              onClick={() => handleViewFacture(facture)}
            >
              <div className="card-body">
                <p className="text-muted mb-1">{facture.reference || "-"}</p>
                <p className="mb-1">Company</p>
                <p className="text-muted">{new Date(facture.date).toLocaleDateString()}</p>
                <hr />
                <p className="fw-bold">{facture.total?.toFixed(3)} TND</p>
                <span
                  className={`badge w-100 py-2 ${
                    facture.statut === "payé"
                      ? "bg-success"
                      : facture.statut === "partiellement payé"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {facture.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
