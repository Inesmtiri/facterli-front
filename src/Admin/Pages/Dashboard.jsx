import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import KpiDevisChart from "../components/kpi/KpiDevisChart";
import RevenueProfitChart from "../components/kpi/RevenueProfitChart";
import FactureStatusChart from "../components/kpi/FactureStatusChart";
import ProduitRentableChart from "../components/kpi/ProduitRentableChart";
import DerniersDevisTable from "../components/kpi/DernierDevisTable";
import KpiTotalFactures from "../components/kpi/KpiTotalFactures";
import KpiTotalDevis from "../components/kpi/KpiTotalDevis";
import KpiTotalDepenses from "../components/kpi/KpiTotalDepenses";
import KpiClientsActifs from "../components/kpi/KpiClientsActifs";
import KpiTotalProfit from "../components/kpi/KpiTotalProfit";

const Dashboard = () => {
  return (
    <div className="container py-111">
      {/* KPI - 5 cartes alignées en flex */}
      <div className="kpi-row mb-4">
        <div className="kpi-item"><KpiTotalFactures /></div>
        <div className="kpi-item"><KpiTotalDevis /></div>
        <div className="kpi-item"><KpiTotalDepenses /></div>
        <div className="kpi-item"><KpiClientsActifs /></div>
        <div className="kpi-item"><KpiTotalProfit /></div>
      </div>

      {/* 📊 3 premiers graphiques alignés horizontalement */}
      <div className="d-flex flex-wrap justify-content-between mb-4 align-items-start">
        {/* 📈 Revenus */}
        <div style={{ width: "34%" }}>
          <div className="card shadow-sm border-0" style={{ height: 260 }}>
            <div className="card-body p-3">
              <RevenueProfitChart />
            </div>
          </div>
        </div>

        {/* 🟢 Taux des devis */}
        <div style={{ width: "30%" }}>
          <div className="card shadow-sm border-0" style={{ height: 260 }}>
            <div className="card-body d-flex align-items-center justify-content-center">
              <KpiDevisChart />
            </div>
          </div>
        </div>

        {/* 📊 Statut des factures */}
        <div style={{ width: "33%" }}>
          <div className="card shadow-sm border-0" style={{ height: 260}}>
            <div className="card-body">
              <FactureStatusChart />
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Derniers Devis + 📈 Produits Rentables côte à côte */}
      <div className="d-flex flex-wrap justify-content-between mb-4">
        {/* Derniers Devis */}
        <div style={{ width: "48%" }}>
          <div className="card shadow-sm border-0" style={{ height: 250, overflowY: "auto" }}>
            <div className="card-body">
              <DerniersDevisTable />
            </div>
          </div>
        </div>

        {/* Produits & Services rentables */}
        <div style={{ width: "48%" }}>
          <div className="card shadow-sm border-0" style={{ height: 300 }}>
            <div className="card-body">
              <ProduitRentableChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
