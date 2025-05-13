import React, { useEffect, useState, useContext } from "react";
import {
  fetchDevisClient,
  acceptDevis,
  refuseDevis,
} from "../../services/devisClientService";
import { SearchContext } from "../../context/SearchContext"; // 🔍 à adapter si besoin

const MesDevis = () => {
  const { searchTerm } = useContext(SearchContext); // 🔍 Recherche globale
  const [devisList, setDevisList] = useState([]);
  const clientId = JSON.parse(localStorage.getItem("userData"))?._id || 
                 JSON.parse(localStorage.getItem("userData"))?.id?._id;


  useEffect(() => {
    const loadDevis = async () => {
      try {
        const data = await fetchDevisClient(clientId);
        const filtered = data.filter((devis) => devis.clientId === clientId);
        setDevisList(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement des devis :", error);
      }
    };

    if (clientId) {
      loadDevis();
    }
  }, [clientId]);

  const filteredDevis = devisList.filter((devis) => {
    const term = searchTerm.toLowerCase();
    return (
      `${devis.reference} ${devis.total} ${devis.date} ${devis.statut}`
        .toLowerCase()
        .includes(term)
    );
  });

  const handleAccept = async (id) => {
    try {
      await acceptDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await refuseDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors du refus :", error);
    }
  };

  const handleViewDevis = (devis) => {
    // ✅ impression identique à ta version
    // (non modifié ici pour alléger)
    // ...
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📑 Mes devis reçus</h2>

      {filteredDevis.length === 0 ? (
        <div className="alert alert-info">
          Aucun devis trouvé.
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {filteredDevis.map((devis) => (
            <div
              key={devis._id}
              className="card text-center shadow-sm"
              style={{ width: "220px", borderRadius: "12px", cursor: "pointer" }}
              onClick={() => handleViewDevis(devis)}
            >
              <div className="card-body">
                <p className="text-muted mb-1">{devis.reference || "-"}</p>
                <p className="mb-1">Company</p>
                <p className="text-muted">{new Date(devis.date).toLocaleDateString()}</p>
                <hr />
                <p className="fw-bold">{devis.total?.toFixed(3)} TND</p>

                {devis.statut === "en attente" ? (
                  <>
                    <button
                      className="btn btn-vert btn-sm w-100 mb-2"
                      onClick={(e) => { e.stopPropagation(); handleAccept(devis._id); }}
                    >
                      Accepter
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={(e) => { e.stopPropagation(); handleRefuse(devis._id); }}
                    >
                      Refuser
                    </button>
                  </>
                ) : (
                  <span
                    className={`badge w-100 py-2 ${devis.statut === "accepté" ? "btn-vert" : "bg-danger"}`}
                  >
                    {devis.statut}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesDevis;
