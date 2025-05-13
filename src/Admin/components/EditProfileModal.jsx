import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const getInitials = (firstName = "", lastName = "") => {
  if (!firstName && !lastName) return "";
  return (firstName[0] || "").toUpperCase() + (lastName[0] || "").toUpperCase();
};

const EditAdressePasswordModal = ({ show, onClose, user = {}, onSave }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ⚙️ Initialise les champs dès que le modal s'ouvre
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPassword("");
    }
  }, [user, show]);

  const initials = getInitials(firstName, lastName);
  const showInitials = initials.length === 2;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user._id) {
      alert("❌ ID utilisateur manquant !");
      return;
    }

    try {
      const response = await axios.put(`https://facterli-server-4.onrender.com/api/users/${user._id}`, {
        firstName,
        lastName,
        email,
        password,
      });

      console.log("✅ Profil mis à jour :", response.data);

      if (onSave) {
        onSave(response.data); // met à jour les données dans la Navbar
      }

      onClose();
    } catch (err) {
      console.error("Erreur de mise à jour du profil :", err);
      alert("❌ Échec de la mise à jour du profil");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" keyboard={false}>
      <div
        className="modal-content border-0"
        style={{
          maxWidth: "380px",
          margin: "auto",
          borderRadius: "12px",
        }}
      >
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
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

export default EditAdressePasswordModal;
