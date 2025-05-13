import React from "react";

const KpiCard = ({ title, value, icon, iconBg = "#0d6efd" }) => {
  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h4 className="fw-bold">{value}</h4>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: iconBg,
              width: 44,
              height: 44,
            }}
          >
            <span className="text-white fs-5">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
