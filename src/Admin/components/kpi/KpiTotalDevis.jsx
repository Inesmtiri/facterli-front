import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileContract } from "react-icons/fa";

const KpiTotalDevis = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get("/api/devis/total");
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur chargement total devis :", err);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="card text-white border-0 h-100 rounded-4"
         style={{ background: "linear-gradient(135deg, #e0bbff, #b197fc)" }}>
      <div className="card-body d-flex flex-column align-items-center text-center">
        <div className="mb-2 d-flex align-items-center justify-content-center rounded-circle"
             style={{ backgroundColor: "rgba(255,255,255,0.2)", width: 50, height: 50 }}>
          <FaFileContract className="text-white fs-4" />
        </div>
        <p className="text-white mb-1">Total Devis</p>
        <h4 className="fw-bold mb-0">{total.toLocaleString("fr-FR")}</h4>
      </div>
    </div>
  );
};

export default KpiTotalDevis;
