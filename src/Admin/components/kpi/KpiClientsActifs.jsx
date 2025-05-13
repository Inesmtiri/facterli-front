import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaArrowDown, FaArrowUp } from "react-icons/fa";

const KpiClientsActifs = () => {
  const [data, setData] = useState({
    taux: 0,
    variation: 0,
    tendance: "",
  });

  useEffect(() => {
    const fetchTauxActifs = async () => {
      try {
        const res = await axios.get("/api/clients/taux-actifs");
        setData(res.data);
      } catch (err) {
        console.error("Erreur chargement taux clients actifs :", err);
      }
    };

    fetchTauxActifs();
  }, []);

  return (
    <div
      className="card border-0 h-100 rounded-4"
      style={{
        background: "linear-gradient(135deg, #c3f8e5, #95e5c5)",
      }}
    >
      <div className="card-body d-flex flex-column align-items-center text-center">
        <div
          className="mb-2 d-flex align-items-center justify-content-center rounded-circle"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            width: 50,
            height: 50,
          }}
        >
          <FaUsers style={{ color: "#f1f3f5" }} className="fs-4" />
        </div>
        <p style={{ color: "#f1f3f5" }} className="mb-1">Clients Actifs</p>
        <h4 style={{ color: "#f1f3f5" }} className="fw-bold mb-0">
          {data.taux}%
        </h4>
        <small
          className="d-flex align-items-center"
          style={{ color: "#f1f3f5" }}
        >
          {data.tendance === "en hausse" && (
            <>
              <FaArrowUp className="me-1" />
              {data.variation}%
            </>
          )}
          {data.tendance === "en baisse" && (
            <>
              <FaArrowDown className="me-1" />
              {data.variation}%
            </>
          )}
        </small>
      </div>
    </div>
  );
};

export default KpiClientsActifs;
