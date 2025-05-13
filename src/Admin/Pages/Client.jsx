import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaTrash, FaPen } from "react-icons/fa";
import ClientForm from "../components/ClientForm";
import { Button, Table } from "react-bootstrap";
import { SearchContext } from "../../context/SearchContext"; // 📌 adapte le chemin selon ton projet

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const { searchTerm } = useContext(SearchContext); // 🔍 récupère ce que tape l'utilisateur

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("https://facterli-server-4.onrender.com/api/clients");
        setClients(res.data);
      } catch (error) {
        console.error("❌ Erreur chargement clients :", error);
      }
    };
    fetchClients();
  }, []);

  // 🔍 Met à jour la liste filtrée quand clients ou recherche changent
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = clients.filter((client) =>
      `${client.nom} ${client.prenom} ${client.email} ${client.societe} ${client.telephone}`
        .toLowerCase()
        .includes(term)
    );
    setFilteredClients(result);
  }, [searchTerm, clients]);

  const handleAddClient = async (clientData) => {
    try {
      const res = await axios.post("https://facterli-server-4.onrender.com/api/clients", clientData);
      const updatedList = [...clients, res.data];
      setClients(updatedList);
    } catch (error) {
      console.error("❌ Erreur création client :", error);
    } finally {
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://facterli-server-4.onrender.com/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("❌ Erreur suppression client :", error);
    }
  };

  const handleEditClick = (client) => {
    setClientToEdit(client);
    setShowForm(true);
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      const res = await axios.put(
        `https://facterli-server-4.onrender.com/api/clients/${updatedClient._id}`,
        updatedClient
      );
      const updatedList = clients.map((c) => (c._id === res.data._id ? res.data : c));
      setClients(updatedList);
      setClientToEdit(null);
    } catch (error) {
      console.error("❌ Erreur mise à jour client :", error);
    } finally {
      setShowForm(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* ✅ Formulaire d’ajout ou modification */}
      {showForm && (
        <ClientForm
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onClose={() => {
            setShowForm(false);
            setClientToEdit(null);
          }}
          clientToEdit={clientToEdit}
        />
      )}

      {/* ✅ Carte formulaire avec style harmonisé */}
      <div className="card shadow-lg mb-4 border-0 rounded-4 mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold text-primary mb-0">
              {clientToEdit ? "✏️ Modifier un client" : "➕ Ajouter un client"}
            </h5>
            <Button
  
  size="sm"
  onClick={() => {
    setShowForm(true);
    setClientToEdit(null); // important pour différencier création/modification
  }}
  className="fw-bold shadow-sm rounded-pill px-4 py-2"
  style={{
    backgroundColor: "#00cc44",
    borderColor: "#00cc44",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    minWidth: "130px",
  }}
>
  Ajouter
</Button>


          </div>
        </div>
      </div>

      {/* ✅ Carte tableau clients avec style unifié */}
      <div className="card shadow-lg border-0 rounded-4 mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="card-body">
          <h5 className="fw-semibold text-primary mb-4">📋 Liste des clients</h5>
          <div className="table-responsive">
            <Table striped hover responsive className="align-middle text-center">
              <thead className="bg-light text-muted">
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Société</th>
                  <th>Téléphone</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client._id}>
                      <td>{client.nom}</td>
                      <td>{client.prenom}</td>
                      <td>{client.email}</td>
                      <td>{client.societe}</td>
                      <td>{client.telephone}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Modifier"
                            onClick={() => handleEditClick(client)}
                          >
                            <FaPen />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Supprimer"
                            onClick={() => handleDelete(client._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Aucun client trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
