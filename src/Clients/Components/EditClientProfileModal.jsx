import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const getInitials = (prenom = "", nom = "") => {
  if (!prenom && !nom) return "";
  return (prenom[0] || "").toUpperCase() + (nom[0] || "").toUpperCase();
};

const EditClientProfileModal = ({ show, onClose, user = {}, onSave }) => {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  useEffect(() => {
    if (user) {
      setPrenom(user.prenom || "");
      setNom(user.nom || "");
      setEmail(user.email || "");
      setMotDePasse("");
    }
  }, [user, show]);

  const initials = getInitials(prenom, nom);
  const showInitials = initials.length === 2;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user._id) {
      alert("❌ ID client manquant !");
      return;
    }

    try {
      const response = await axios.put(`https://facterli-server-4.onrender.com/api/clients/${user._id}`, {
        prenom,
        nom,
        email,
        motDePasse,
      });

      console.log("✅ Profil client mis à jour :", response.data);
      if (onSave) {
        onSave(response.data);
      }
      onClose();
    } catch (err) {
      console.error("Erreur de mise à jour client :", err);
      alert("❌ Échec de la mise à jour du profil client");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
      <div className="modal-content border-0" style={{ maxWidth: "380px", margin: "auto", borderRadius: "12px" }}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center fs-5">Modifier le profil</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex justify-content-center mb-4">
            <div
              className="rounded-circle border border-2 d-flex align-items-center justify-content-center"
              style={{
                width: 70,
                height: 70,
                fontSize: showInitials ? "18px" : "22px",
                fontWeight: "bold",
                color: "#0d6efd",
              }}
            >
              {showInitials ? initials : <FaUser />}
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default EditClientProfileModal;
