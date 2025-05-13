import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Card,
} from "react-bootstrap";
import { FaTrash, FaPen } from "react-icons/fa";
import AddProduitModal from "../components/Produits/AddProduit";
import AddServiceModal from "../components/Produits/AddService";
import ProduitServiceTabs from "../components/Produits/ProduitServiceTabs";
import axios from "axios";
import { SearchContext } from "../../context/SearchContext"; // ⚠️ adapte le chemin si besoin

const ProduitServicePage = () => {
  const { searchTerm } = useContext(SearchContext); // 🔍 recherche globale

  const [activeTab, setActiveTab] = useState("produits");

  const [showAddProduitModal, setShowAddProduitModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);
  const [produitEnCours, setProduitEnCours] = useState(null);
  const [serviceEnCours, setServiceEnCours] = useState(null);

  const [filteredProduits, setFilteredProduits] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchProduits();
    fetchServices();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const produitsFiltres = produits.filter((p) =>
      `${p.reference} ${p.categorie} ${p.stockActuel}`
        .toLowerCase()
        .includes(term)
    );
    const servicesFiltres = services.filter((s) =>
      `${s.nom} ${s.description}`
        .toLowerCase()
        .includes(term)
    );

    setFilteredProduits(produitsFiltres);
    setFilteredServices(servicesFiltres);
  }, [searchTerm, produits, services]);

  const fetchProduits = async () => {
    try {
      const res = await axios.get("https://facterli-server-4.onrender.com/api/produits");
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("https://facterli-server-4.onrender.com/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Erreur chargement services:", err);
    }
  };

  const handleAddProduit = async (produit) => {
    try {
      if (produitEnCours) {
        const res = await axios.put(`https://facterli-server-4.onrender.com/api/produits/${produitEnCours._id}`, produit);
        setProduits(produits.map(p => p._id === produitEnCours._id ? res.data : p));
        setProduitEnCours(null);
      } else {
        const res = await axios.post("https://facterli-server-4.onrender.com/api/produits", produit);
        setProduits([...produits, res.data]);
      }
      setShowAddProduitModal(false);
    } catch (err) {
      console.error("Erreur ajout/modif produit:", err);
    }
  };

  const handleAddService = async (service) => {
    try {
      if (serviceEnCours) {
        const res = await axios.put(`https://facterli-server-4.onrender.com/api/services/${serviceEnCours._id}`, service);
        setServices(services.map(s => s._id === serviceEnCours._id ? res.data : s));
        setServiceEnCours(null);
      } else {
        const res = await axios.post("https://facterli-server-4.onrender.com/api/services", service);
        setServices([...services, res.data]);
      }
      setShowAddServiceModal(false);
    } catch (err) {
      console.error("Erreur ajout/modif service:", err);
    }
  };

  const handleDeleteProduit = async (id) => {
    try {
      await axios.delete(`https://facterli-server-4.onrender.com/api/produits/${id}`);
      setProduits(produits.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erreur suppression produit:", err);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`https://facterli-server-4.onrender.com/api/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Erreur suppression service:", err);
    }
  };

  const dataToDisplay = activeTab === "produits" ? filteredProduits : filteredServices;

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
        <Button
  className="shadow-sm rounded-pill fw-bold px-4 py-2 text-white"
  style={{
    backgroundColor: "#23BD15",
    borderColor: "#23BD15",
    minWidth: "150px",
  }}
  onClick={() => {
    activeTab === "produits" ? setShowAddProduitModal(true) : setShowAddServiceModal(true);
    setProduitEnCours(null);
    setServiceEnCours(null);
  }}
>
  Ajouter
</Button>

        </Col>
      </Row>

      <ProduitServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
        <h5 className="mb-4 fw-semibold text-primary">
          {activeTab === "produits" ? "Liste des produits" : "Liste des services"}
        </h5>

        {dataToDisplay.length > 0 ? (
          <Table responsive className="align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th className="text-start">{activeTab === "produits" ? "Référence" : "Nom"}</th>
                <th>{activeTab === "produits" ? "Catégorie" : "Description"}</th>
                {activeTab === "produits" && <th>Stock</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.map((item) => (
                <tr key={item._id}>
                  <td className="text-start fw-semibold">
                    {activeTab === "produits" ? item.reference : item.nom}
                  </td>
                  <td className="text-muted small">
                    {activeTab === "produits" ? item.categorie : item.description}
                  </td>
                  {activeTab === "produits" && (
                    <td>
                     <span
  style={{
    backgroundColor: item.stockActuel === 0 ? "#F8D7DA" : "#FFF3CD", // 🔴 ou 🟡 pastel
    color: item.stockActuel === 0 ? "#721c24" : "#856404",           // texte foncé
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "500",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "0.875rem",
  }}
>
  {item.stockActuel === 0 ? "Rupture" : "En stock"}
</span>


                    </td>
                  )}
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                    <Button
  variant="outline-success"
  size="sm"
  onClick={() => {
    if (activeTab === "produits") {
      setProduitEnCours(item);
      setShowAddProduitModal(true);
    } else {
      setServiceEnCours(item);
      setShowAddServiceModal(true);
    }
  }}
>
  <FaPen className="text-primary" />
</Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          activeTab === "produits"
                            ? handleDeleteProduit(item._id)
                            : handleDeleteService(item._id)
                        }
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">
            Aucun {activeTab === "produits" ? "produit" : "service"} trouvé.
          </p>
        )}
      </Card>

      <AddProduitModal
        show={showAddProduitModal}
        onHide={() => {
          setShowAddProduitModal(false);
          setProduitEnCours(null);
        }}
        onSave={handleAddProduit}
        produit={produitEnCours}
      />

      <AddServiceModal
        show={showAddServiceModal}
        onHide={() => {
          setShowAddServiceModal(false);
          setServiceEnCours(null);
        }}
        onSave={handleAddService}
        service={serviceEnCours}
      />
    </Container>
  );
};

export default ProduitServicePage;
