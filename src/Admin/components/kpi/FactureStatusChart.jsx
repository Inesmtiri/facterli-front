import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  payé: "#95e5c5",       // vert pastel
  partiel: "#ffe066",    // jaune pastel
  nonPayé: "#ffa8a8",    // rouge pastel
};

const FactureStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/factures/statut-mensuel");
        setData(res.data);
      } catch (err) {
        console.error("Erreur chargement des statistiques :", err);
      }
    };

    fetchStats();
  }, []);

  if (!data.length) return <p className="text-muted text-center">Chargement du graphique...</p>;

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="d-flex justify-content-center list-unstyled gap-3 mt-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="d-flex align-items-center gap-1">
            <span style={{
              backgroundColor: entry.color,
              width: 12,
              height: 12,
              display: "inline-block",
              borderRadius: 2,
            }}></span>
            <span style={{ color: "#000", fontSize: 13 }}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <h6 className="text-center fw-semibold mb-3">Statut des factures par mois</h6>
      <ResponsiveContainer width="100%" height={225}>
  <BarChart
    data={data}
    margin={{ top: 5, right: 20, left: 5, bottom: 5 }} // même que LineChart
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mois" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Legend content={renderCustomLegend} />
    <Bar dataKey="nonPayé" stackId="a" fill={COLORS.nonPayé} name="Non payé" />
    <Bar dataKey="partiel" stackId="a" fill={COLORS.partiel} name="Partiellement payé" />
    <Bar dataKey="payé" stackId="a" fill={COLORS.payé} name="Payé" />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};

export default FactureStatusChart;