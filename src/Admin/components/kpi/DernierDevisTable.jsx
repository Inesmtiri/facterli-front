import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const DerniersDevisTable = () => {
  const [devis, setDevis] = useState([]);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const res = await axios.get("/api/devis/recents");
        setDevis(res.data);
      } catch (error) {
        console.error("Erreur chargement derniers devis :", error);
      }
    };

    fetchDevis();
  }, []);

  return (
    <div>
      <h6 className="mb-2">Derniers Devis</h6>
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Numéro</th>
              <th>Client</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {devis.map((d) => (
              <tr key={d._id}>
                <td className="fw-bold">#{d.numeroDevis}</td>
                <td>{d.client}</td>
                <td>{new Date(d.date).toLocaleDateString("fr-FR")}</td>
                <td>
                  <span
                    className={`badge rounded-pill d-inline-flex align-items-center px-3 py-1 fw-semibold ${
                      d.statut === "accepté"
                        ? "bg-success bg-opacity-25 text-success"
                        : d.statut === "refusé"
                        ? "bg-danger bg-opacity-25 text-danger"
                        : "bg-warning bg-opacity-25 text-warning"
                    }`}
                  >
                    {d.statut === "accepté" && (
                      <i className="bi bi-check-circle-fill me-2"></i>
                    )}
                    {d.statut === "refusé" && (
                      <i className="bi bi-x-circle-fill me-2"></i>
                    )}
                    {d.statut === "en attente" && (
                      <i className="bi bi-clock-fill me-2"></i>
                    )}
                    {d.statut.charAt(0).toUpperCase() + d.statut.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DerniersDevisTable;
