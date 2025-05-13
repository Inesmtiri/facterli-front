import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";

// ✅ Pages publiques
import WelcomePage from './Admin/Pages/WelcomePage';
import Connexion from './Admin/Pages/Connexion';
import DashboardClient from './Clients/Pages/DashboardClient';

// ✅ Pages internes (admin)
import Dashboard from './Admin/Pages/Dashboard';
import Client from './Admin/Pages/Client';
import Devis from './Admin/Pages/Devis';
import Factures from './Admin/Pages/Factures';
import Depenses from './Admin/Pages/Depense';
import Produits from './Admin/Pages/Produits';
import Paiement from './Admin/Pages/Paiement';

// ✅ Layout
import Layout from './Admin/components/Layout';

// ✅ Interface client
import MesDevis from './Clients/Pages/MesDevis';
import MesFacture from './Clients/Pages/MesFacture';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.style.opacity = 0;
        preloader.style.pointerEvents = "none";
        setTimeout(() => {
          preloader.style.display = "none";
          setIsLoading(false); // ✅ ici on dit à React de démarrer le rendu
        }, 500);
      } else {
        setIsLoading(false); // fallback si jamais le preloader est absent
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return null; // ✅ empêche React de rendre quoi que ce soit tant que le préloader est actif

  return (
    <div className="App">
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            {/* ✅ Pages publiques */}
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<Connexion />} />

            {/* ✅ Pages avec Layout commun */}
            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="client" element={<Client />} />
              <Route path="devis" element={<Devis />} />
              <Route path="factures" element={<Factures />} />
              <Route path="depenses" element={<Depenses />} />
              <Route path="produits" element={<Produits />} />
              <Route path="paiement" element={<Paiement />} />

              {/* ✅ Interface client */}
              <Route path="client/dashboard" element={<DashboardClient />} />
              <Route path="client/mes-devis" element={<MesDevis />} />
              <Route path="client/mes-factures" element={<MesFacture />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </div>
  );
}

export default App;
