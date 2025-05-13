import axios from "axios";

const API_URL = "https://facterli-server-4.onrender.com/api/mes-devis";

// 🔁 Récupérer les devis du client
export const fetchDevisClient = async (clientId) => {
  const id = typeof clientId === "object" ? clientId._id : clientId; // ✅ Sécurité
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// ✅ Accepter un devis
export const acceptDevis = async (devisId) => {
  const res = await axios.put(`${API_URL}/${devisId}/accept`);
  return res.data;
};

// ✅ Refuser un devis
export const refuseDevis = async (devisId) => {
  const res = await axios.put(`${API_URL}/${devisId}/refuse`);
  return res.data;
};
