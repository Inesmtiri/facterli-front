import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://facterli-server-4.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { role } = res.data;
      localStorage.setItem("userData", JSON.stringify(res.data)); // ✅ Clé corrigée

      // ✅ Redirection selon le rôle
      if (role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/client/dashboard";
      }
    } catch (err) {
      console.error("❌ Erreur de connexion :", err);
      setMessage("❌ Email ou mot de passe incorrect !");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#4dabf7" }}
    >
      {/* Logo / titre */}
      <div className="text-center fst-italic text-white position-absolute top-0 mt-4 fs-2 fw-bold">
        Facterli
      </div>

      {/* Formulaire */}
      <div
        className="bg-white p-5 rounded-5 shadow-lg text-center d-flex flex-column justify-content-center"
        style={{ width: "480px", height: "500px" }}
      >
        <h2 className="fs-2 fst-italic  fw-semibold mb-4">Connexion</h2>

        {message && <div className="alert alert-danger">{message}</div>}

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="form-control mb-3 p-3 rounded-4"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
<button
  className="btn w-100 p-3 rounded-4 border-0 text-white"
  style={{ backgroundColor: "#00cc44", color: "#155724" }} // couleur texte adaptée
  type="submit"
>
            Connexion
            </button>
        </form>

        {/* Liens vers les autres pages */}
       
      </div>
    </div>
  );
}
