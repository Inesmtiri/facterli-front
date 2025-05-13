import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const ClientForm = ({ onAddClient, onClose, clientToEdit, onUpdateClient }) => {
  const [formClient, setFormClient] = useState({
    nom: "",
    prenom: "",
    societe: "",
    telephone: "",
    email: "",
    adresse: "",
    motDePasse: ""
  });

  useEffect(() => {
    if (clientToEdit) {
      setFormClient(clientToEdit);
    }
  }, [clientToEdit]);

  const generatePassword = () => Math.random().toString(36).slice(-8);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormClient({ ...formClient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom, prenom, email, societe, telephone, adresse } = formClient;

    if (!nom || !prenom || !email || !societe || !telephone || !adresse) {
      alert("⚠️ Tous les champs sont obligatoires.");
      return;
    }

    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(telephone)) {
      alert("📞 Le numéro de téléphone doit contenir exactement 8 chiffres.");
      return;
    }

    try {
      if (clientToEdit) {
        await axios.put(`https://facterli-server-4.onrender.com/api/clients/${formClient._id}`, formClient);
        onUpdateClient?.(formClient);
        alert("✅ Client modifié avec succès !");
      } else {
        const motDePasseGenere = generatePassword();
        const clientData = { ...formClient, motDePasse: motDePasseGenere };

        const response = await axios.post("https://facterli-server-4.onrender.com/api/clients", clientData);
        onAddClient?.(response.data);
        alert(`✅ Client créé avec succès !\n\n🛡️ Mot de passe généré : ${motDePasseGenere}`);
      }

      setFormClient({
        nom: "",
        prenom: "",
        societe: "",
        telephone: "",
        email: "",
        adresse: "",
        motDePasse: ""
      });

      onClose?.(); // Ferme le formulaire
    } catch (error) {
      if (error.response?.status === 409) {
        alert("⚠️ Un client avec cet email existe déjà !");
      } else {
        console.error("Erreur :", error);
        alert("❌ Une erreur s'est produite.");
      }
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1055 }} // ✅ z-index élevé pour que le fond soit cliquable
    >
      <div className="bg-white p-4 rounded-4 shadow" style={{ width: "500px" }}>
        <h4 className="text-center fw-semibold mb-4">
          {clientToEdit ? "Modifier le client" : "Nouveau client"}
        </h4>

        <Form onSubmit={handleSubmit}>
          {["nom", "prenom", "societe", "telephone", "adresse", "email"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Control
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formClient[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="rounded-3"
                required
              />
            </Form.Group>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-primary"
              className="px-4 py-2 shadow-sm fw-bold rounded-pill"
              onClick={onClose} // ✅ fonction correcte ici
            >
              Annuler
            </Button>

            <Button
  type="submit"
  className="px-4 py-2 shadow fw-bold text-white rounded-pill border-0"
  style={{
    backgroundColor: clientToEdit ? "#ffc107" : "#00cc44", // Jaune ou Vert perso
  }}
>
  {clientToEdit ? "Modifier" : "Enregistrer"}
</Button>

          </div>
        </Form>
      </div>
    </div>
  );
};

export default ClientForm;
