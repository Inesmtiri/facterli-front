import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#2a9d8f", "#95e5c5"]; // 🌿 Vert d’eau foncé, clair

const KpiDevisChart = () => {
  const [taux, setTaux] = useState(0);
  const [tendance, setTendance] = useState(0);
  const [variation, setVariation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTauxConversion = async () => {
      try {
        const res = await axios.get("/api/devis/taux-conversion");
        setTaux(parseFloat(res.data.taux));
        setTendance(parseFloat(res.data.tendance));
        setVariation(res.data.variation);
      } catch (err) {
        console.error("Erreur chargement taux de conversion :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTauxConversion();
  }, []);

  const data = [
    { name: "Convertis", value: taux },
    { name: "Non convertis", value: 100 - taux },
  ];

  return (
    <div className="text-center">
      <div className="d-flex justify-content-between align-items-center px- mb-2 gap-4">
        <p className="fw-semibold mb-0">Taux de conversion des devis      </p>
        {!loading && (
          <>
            {variation === "en hausse" && (
              <span className="text-success fw-bold d-flex align-items-center gap-3">
                <span style={{ fontSize: "1rem" }}>▲</span>
                {tendance.toFixed(1)}%
              </span>
            )}
            {variation === "en baisse" && (
              <span className="text-danger fw-bold d-flex align-items-center gap-1">
                <span style={{ fontSize: "1rem" }}>▼</span>
                {tendance.toFixed(1)}%
              </span>
            )}
            {variation === "stable" && (
              <span className="text-secondary fw-bold d-flex align-items-center gap-1">
                <span style={{ fontSize: "0.8rem" }}>●</span>
                {tendance.toFixed(1)}%
              </span>
            )}
          </>
        )}
      </div>

      {loading ? (
        <p className="text-muted">Chargement...</p>
      ) : (
        <div style={{ position: "relative", width: "100%", height: 160 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
                startAngle={90}
                endAngle={-270}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#2a9d8f",
            }}
          >
            {taux.toFixed(0)}%
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center gap-3 mt-0 small">
        <div className="d-flex align-items-center gap-1">
          <span style={{ color: COLORS[0], fontSize: "1.2rem" }}>●</span> Convertis
        </div>
        <div className="d-flex align-items-center gap-1">
          <span style={{ color: COLORS[1], fontSize: "1.2rem" }}>●</span> Non convertis
        </div>
      </div>
    </div>
  );
};

export default KpiDevisChart;
