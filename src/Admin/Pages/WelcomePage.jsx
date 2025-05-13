import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS

function WelcomePage() {
  const navigate = useNavigate();

  // 🎨 Ton vert exact !
  const vertVif = "#00B400";

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <header
        className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        style={{ backgroundColor: "#4dabf7" }}
      >
        <h4
          style={{
            fontSize: "1.8rem",
            fontFamily: "'Marhey', sans-serif",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "1px",
          }}
        >
          Facterli
        </h4>

        <div className="d-flex gap-2">
          <button className="btn btn-light" onClick={() => navigate("/Login")}>
            Connexion
          </button>

          
        </div>
      </header>

      {/* Section principale */}
      <main
        className="text-center text-white py-5"
        style={{ backgroundColor: "#4dabf7" }}
      >
        <h2 className="fs-2 fw-bold mb-4">
          Dès devis aux paiements tout en un clic !
        </h2>

        <button
          className="btn btn-lg"
          style={{
            backgroundColor: vertVif,
            color: "#fff",
            fontWeight: "bold",
            padding: "10px 30px",
            borderRadius: "8px",
          }}
          onClick={() => navigate("/Login")}
        >
connexion </button>
      </main>

      {/* Image Section */}
      <div className="text-center">
        <img
          src="/photo.png"
          alt="Description de l'image"
          className="img-fluid"
          style={{
            maxHeight: "500px",
            objectFit: "cover",
            width: "100%",
          }}
        />
      </div>

      {/* Services Section */}
      <section className="container my-5">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {/* Card 1 */}
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="card-text">
                  <h3 className="card-title">
                    Création rapide de devis et factures
                  </h3>
                  <p className="card-text">
                    Simplifiez votre facturation avec notre solution intuitive.
                    Créez des devis et factures professionnels en quelques clics.
                  </p>
                </div>
                <img
                  src="/photo1.png"
                  alt="Facturation"
                  className="img-fluid ms-3"
                  style={{ width: "100px" }}
                />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <img
                  src="/photo2.png"
                  alt="Clients"
                  className="img-fluid ms-3"
                  style={{ width: "100px" }}
                />
                <div className="card-text">
                  <h3 className="card-title">Gestion des clients et sociétés</h3>
                  <p className="card-text">
                    Optimisez votre relation client et boostez votre vie
                    financière !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className="card-text">
                  <h3 className="card-title">
                    Paiement des factures en un click !
                  </h3>
                  <p className="card-text">
                    Simplifiez et accélérez vos paiements grâce à notre option
                    de paiement en un clic.
                  </p>
                </div>
                <img
                  src="/photo3.png"
                  alt="Paiement sécurisé"
                  className="img-fluid ms-3"
                  style={{ width: "100px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="container bg-white p-5 shadow-sm rounded">
        <h2 className="text-center fs-3 fw-bold mb-4">À propos de nous</h2>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          <div className="col">
            <h3 className="fw-bold fs-5">
              Conforme au règlement de l’ère tunisien
            </h3>
            <p className="text-muted fs-6">
              Notre solution est en conformité avec les réglementations locales.
            </p>
          </div>

          <div className="col">
            <h3 className="fw-bold fs-5">Codées selon votre histoire</h3>
            <p className="text-muted fs-6">
              Nous créons des solutions adaptées à votre entreprise.
            </p>
          </div>

          <div className="col">
            <h3 className="fw-bold fs-5">Évolutif et performant</h3>
            <p className="text-muted fs-6">
              Notre plateforme est pensée pour grandir avec votre business.
            </p>
          </div>

          <div className="col">
            <h3 className="fw-bold fs-5">Sécurisé et fiable</h3>
            <p className="text-muted fs-6">
              Nous garantissons la sécurité et la confidentialité de vos données.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; 2025 - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default WelcomePage;
