import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave } from "react-icons/fa";

const KpiTotalProfit = () => {
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await axios.get("/api/factures/profit");
        setProfit(res.data.profit);
      } catch (err) {
        console.error("Erreur chargement profit :", err);
      }
    };

    fetchProfit();
  }, []);

  return (
    <div
      className="card border-0 h-100 rounded-4"
      style={{ background: "linear-gradient(135deg, #fff3bf, #ffe066)" }}
    >
      <div className="card-body d-flex flex-column align-items-center text-center">
        <div
          className="mb-2 d-flex align-items-center justify-content-center rounded-circle"
          style={{ backgroundColor: "#fff3bf", width: 50, height: 50 }}
        >
          <FaMoneyBillWave className="text-white fs-4" />
        </div>
        <p className="text-white mb-1">Total Profit</p>
        <h4 className="fw-bold mb-0 text-white">
          {profit.toLocaleString("fr-FR")} DT
        </h4>
      </div>
    </div>
  );
};

export default KpiTotalProfit;
