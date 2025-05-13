import React, { useState, useEffect, useRef } from "react";

const DepenseForm = ({ onCancel, onSave, editData }) => {
  const [categorie, setCategorie] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [commercant, setCommercant] = useState("");
  const [fichierRecu, setFichierRecu] = useState(null);
  const [total, setTotal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setCategorie(editData.categorie || "");
      setDate(editData.date?.slice(0, 10) || "");
      setDescription(editData.description || "");
      setCommercant(editData.commercant || "");
      setFichierRecu(editData.image || null);
      setTotal(editData.montant || "");
    } else {
      setCategorie("");
      setDate(new Date().toISOString().slice(0, 10));
      setDescription("");
      setCommercant("");
      setFichierRecu(null);
      setTotal("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(date);

    if (!categorie.trim()) {
      setErrorMessage("Veuillez saisir une catégorie !");
      return;
    }
    if (!commercant.trim()) {
      setErrorMessage("Veuillez saisir un commerçant !");
      return;
    }
    if (!total || isNaN(total) || parseFloat(total) <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0 !");
      return;
    }
    if (selectedDate > today) {
      setErrorMessage("La date de la dépense ne peut pas être dans le futur !");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Veuillez saisir une description !");
      return;
    }

    const depense = {
      categorie,
      montant: parseFloat(total),
      date,
      description,
      commercant,
      fichierRecu: fichierRecu || "",
    };

    onSave(depense);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFichierRecu(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFichierRecu(null);
      alert("Veuillez sélectionner uniquement une image !");
    }
  };

  return (
    <div className="container mt-2 d-flex">
      <div>
        <h4 className="mb-3 fw-bold">{editData ? "Modifier dépense" : "Nouvelle dépense"}</h4>

        {errorMessage && (
          <div className="alert alert-warning alert-dismissible fade show" role="alert">
            {errorMessage}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setErrorMessage("")}></button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow-sm"
          style={{ width: "800px", minHeight: "600px" }}
        >
          <div className="d-flex justify-content-between">
            {/* Colonne gauche */}
            <div style={{ flex: 1, marginRight: "20px" }}>
              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Ajouter une catégorie
                <input
                  type="text"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Date
                <input
                  type="date"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={date}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Ajouter un commerçant
                <input
                  type="text"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={commercant}
                  onChange={(e) => setCommercant(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Ajouter une description
                <textarea
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Zone reçu */}
            <div style={{ width: "250px" }}>
              <div
                className="border rounded bg-light d-flex align-items-center justify-content-center p-4 text-center"
                style={{ borderStyle: "dashed", height: "220px", position: "relative" }}
              >
                <div>
                  <i className="bi bi-paperclip fs-4 position-absolute top-0 end-0 me-2 mt-2"></i>
                  <p className="mb-1 text-muted">Drag receipt image here</p>
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    or select a file
                  </span>
                  <input
                    id="fileUpload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="form-control d-none"
                    onChange={handleFileChange}
                  />
                  {fichierRecu && (
                    <img
                      src={fichierRecu}
                      alt="Reçu"
                      style={{ marginTop: "10px", width: "100%", borderRadius: "8px" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center text-muted mt-3">
            <span className="fw-semibold">Grand Total (TND):</span>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <input
                type="text"
                className="form-control border-0 ps-0 text-end"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                style={{
                  width: "120px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "transparent",
                }}
              />
              <span className="fw-bold">DT</span>
            </div>
          </div>

          {/* Boutons */}
          <div className="d-flex flex-column justify-content-start align-items-end ms-3 mt-5" style={{ gap: "10px" }}>
            <button
              type="submit"
              className={`btn px-4 py-2 shadow rounded-pill ${editData ? 'btn-warning' : 'btn-vert'}`}
              style={{ fontWeight: "bold", minWidth: "150px" }}
            >
              {editData ? "Modifier" : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-pill"
              style={{ fontWeight: "bold", minWidth: "150px" }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepenseForm;
