import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const AddProduit = ({ show, onHide, onSave, produit = null }) => {
  const [formData, setFormData] = useState({
    nom: "",
    categorie: "",
    enAchat: false,
    enVente: false,
    prixVente: "",
    prixAchat: "",
    stockMin: "",
    stockActuel: "",
  });

  useEffect(() => {
    if (produit) {
      setFormData({
        reference: produit.reference || "",
        categorie: produit.categorie || "",
        enAchat: produit.enAchat || false,
        enVente: produit.enVente || false,
        prixVente: produit.prixVente || "",
        prixAchat: produit.prixAchat || "",
        stockMin: produit.stockMin || "",
        stockActuel: produit.stockActuel || "",
      });
    } else {
      setFormData({
        reference: "",
        categorie: "",
        enAchat: false,
        enVente: false,
        prixVente: "",
        prixAchat: "",
        stockMin: "",
        stockActuel: "",
      });
    }
  }, [produit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    if (!formData.reference || !formData.categorie) {
      alert("La référence et la catégorie sont obligatoires !");
      return;
    }

    const stockActuel = parseInt(formData.stockActuel, 10);
    const statut = stockActuel === 0 ? "rupture" : "en stock";

    const dataToSend = {
      ...formData,
      stockActuel,
      statut,
    };

    onSave(dataToSend);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="fw-normal fst-italic">
            {produit ? "Modifier le produit :" : "Nouveau produit :"}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Référence :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Référence"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Catégorie :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                placeholder="Catégorie"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={4}>En achat :</Form.Label>
            <Col sm={2}>
              <Form.Check
                type="checkbox"
                name="enAchat"
                checked={formData.enAchat}
                onChange={handleChange}
              />
            </Col>
            <Form.Label column sm={2} className="text-end">En vente :</Form.Label>
            <Col sm={4}>
              <Form.Check
                type="checkbox"
                name="enVente"
                checked={formData.enVente}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Prix de vente :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="prixVente"
                value={formData.prixVente}
                onChange={handleChange}
                placeholder="Prix de vente"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Prix d'achat :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="prixAchat"
                value={formData.prixAchat}
                onChange={handleChange}
                placeholder="Prix d'achat"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Stock minimal :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="stockMin"
                value={formData.stockMin}
                onChange={handleChange}
                placeholder="Stock minimal"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Stock actuel :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="stockActuel"
                value={formData.stockActuel}
                onChange={handleChange}
                placeholder="Stock actuel"
                min="0"
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
    backgroundColor: produit ? "#ffc107" : "#00B507",
    borderColor: produit ? "#ffc107" : "#00B507",
    minWidth: "150px",
  }}
>
  {produit ? "Modifier" : "Créer"}
</Button>

</Modal.Footer>

    </Modal>
  );
};

export default AddProduit;
