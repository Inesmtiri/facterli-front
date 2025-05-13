import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const AddService = ({ show, onHide, onSave, service = null }) => {
  const [serviceState, setServiceState] = useState({
    nom: "",
    description: "",
    tarif: ""
  });

  // ⚙️ Mettre à jour le formulaire si on édite un service
  useEffect(() => {
    if (service) {
      setServiceState(service);
    } else {
      setServiceState({
        nom: "",
        description: "",
        tarif: ""
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceState({
      ...serviceState,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!serviceState.nom) {
      alert("Le nom est requis !");
      return;
    }

    try {
      let response;
      if (service && service._id) {
        // 🔁 Si service existe => modifier
        response = await axios.put(`https://facterli-server-4.onrender.com/api/services/${service._id}`, serviceState);
      } else {
        // ➕ Sinon => créer
        response = await axios.post("https://facterli-server-4.onrender.com/api/services", serviceState);
      }

      if (onSave) onSave(response.data);
      onHide();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du service :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="fw-normal fst-italic">
            {service ? "Modifier le service :" : "Nouveau service :"}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Nom :</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="nom"
                value={serviceState.nom}
                onChange={handleChange}
                placeholder="Nom du service"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Description :</Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={serviceState.description}
                onChange={handleChange}
                placeholder="Description du service"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Tarif :</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                name="tarif"
                value={serviceState.tarif}
                onChange={handleChange}
                placeholder="Tarif en TND"
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end gap-2">
        {/* Bouton Annuler - même style que DevisForm */}
        <button
        type="button"
        onClick={onHide}
        className="btn fw-bold text-primary border border-primary rounded-pill px-4 py-2 shadow-sm"
        style={{ backgroundColor: "transparent", minWidth: "150px" }}
      >
        Annuler
      </button>
      
      
        {/* Bouton Créer ou Modifier */}
        <Button
  onClick={handleSave}
  className="shadow-sm rounded-pill fw-bold px-4 py-2 text-white"
  style={{
    backgroundColor: service ? "#ffc107" : "#00B507",
    borderColor: service ? "#ffc107" : "#00B507",
    minWidth: "150px",
  }}
>
  {service ? "Modifier" : "Créer"}
</Button>

      </Modal.Footer>
    </Modal>
  );
};

export default AddService;
