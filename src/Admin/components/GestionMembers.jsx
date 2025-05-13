import React, { useState } from "react";

const GestionMembers = ({ equipe, onUpdateEquipe, onClose }) => {
  const membresDisponibles = [
    { id: 1, nom: "Ines Mtiri", role: "Owner" },
    { id: 2, nom: "Takwa Akacha", role: "Manager" },
    { id: 3, nom: "Yassine Ali", role: "Dev" },
    { id: 4, nom: "Amira Ben Ali", role: "Designer" },
  ];

  const [selectedIds, setSelectedIds] = useState(equipe.map((m) => m.id));

  const toggleSelect = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSave = () => {
    const updatedEquipe = membresDisponibles.filter((m) =>
      selectedIds.includes(m.id)
    );
    onUpdateEquipe(updatedEquipe);
    onClose();
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 2000,
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "500px",
          borderRadius: "16px",
          backgroundColor: "#fff",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary mb-0">
            <i className="bi bi-people-fill me-2"></i> Gestion des membres
          </h4>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            title="Fermer"
          ></button>
        </div>

        {/* Member List */}
        <ul className="list-group mb-4">
          {membresDisponibles.map((member) => (
            <li
              key={member.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", transition: "background-color 0.2s" }}
              onClick={() => toggleSelect(member.id)}
            >
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-3"
                  checked={selectedIds.includes(member.id)}
                  readOnly
                />
                <div>
                  <strong>{member.nom}</strong>
                  <div className="text-muted small">{member.role}</div>
                </div>
              </div>
              {selectedIds.includes(member.id) && (
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
              )}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-vert px-4"
            onClick={handleSave}
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionMembers;
