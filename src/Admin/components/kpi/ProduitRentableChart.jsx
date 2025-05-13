import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

// 🎨 Couleurs pastel
const pastelColors = [
  "#A0E7E5", "#B4F8C8", "#FFAEBC", "#FBE7C6", "#CDB4DB",
  "#D8F3DC", "#FFD6A5", "#CAF0F8", "#FFADAD", "#B5EAD7"
];

// ✅ Tooltip sécurisé
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="p-2 shadow-sm bg-white border rounded">
        <strong>{data?.nom || "Produit inconnu"}</strong><br />
        Catégorie : {data?.type || "—"}<br />
        Profit : {typeof data?.profit === "number" ? data.profit.toLocaleString() + " €" : "N/A"}
      </div>
    );
  }
  return null;
};

const ProduitRentableBubbleChart = () => {
  const [data, setData] = useState([]);
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/factures/produits-rentables");
        const itemCount = res.data.length;
        const totalWidth = 40; // largeur totale en % pour répartir les bulles
        const startX = 50 - (totalWidth / 2); // début centré autour de 50

        const transformed = res.data.map((item, index) => ({
          ...item,
          x: startX + (index * (totalWidth / Math.max(itemCount - 1, 1))),
          y: 50, // aligné verticalement
          z: typeof item.profit === "number" ? item.profit : 0,
          color: pastelColors[index % pastelColors.length],
        }));

        setData(transformed);
        setLegendItems(transformed);
      } catch (err) {
        console.error("Erreur chargement produits rentables :", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <h6 className="card-title mb-3">
         Produits les plus rentables (par profit)
      </h6>

      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart>
          <XAxis dataKey="x" type="number" hide domain={[0, 100]} />
          <YAxis dataKey="y" type="number" hide domain={[0, 100]} />
          <ZAxis dataKey="z" range={[200, 2000]} name="Profit (€)" />
          <Tooltip content={<CustomTooltip />} />
          {data.map((entry, idx) => (
            <Scatter
              key={idx}
              data={[entry]}
              fill={entry.color}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      {/* ✅ Légende propre */}
      <div className="d-flex flex-wrap mt-3 px-2">
        {legendItems.map((item, idx) => (
          <div
            key={idx}
            className="d-flex align-items-center me-3 mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            <div
              style={{
                backgroundColor: item.color,
                width: 14,
                height: 14,
                borderRadius: "50%",
                marginRight: 6,
              }}
            ></div>
            {item.nom}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProduitRentableBubbleChart;
