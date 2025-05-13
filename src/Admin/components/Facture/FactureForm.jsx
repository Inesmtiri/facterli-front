import React, { useEffect, useState, useRef } from "react";
import { FaTrash, FaPrint } from "react-icons/fa";
import axios from "axios";
import ClientForm from "../ClientForm";

const FactureForm = ({ onAddFacture, onCancel, editData }) => {
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);
  const [clientId, setClientId] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState(editData?.nomEntreprise || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroFacture, setNumeroFacture] = useState("");
  const [reference, setReference] = useState(editData?.reference || "");
  const [tvaRate, setTvaRate] = useState(editData?.tvaRate || 19);
  const [remise, setRemise] = useState(editData?.remise || 0);
  const [logo, setLogo] = useState(editData?.logo || null);
  const [lignes, setLignes] = useState(editData?.lignes || [{ itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]);
  const [showClientForm, setShowClientForm] = useState(false);
  const printRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateNumeroFacture = async () => {
    try {
      const res = await axios.get("/api/factures");
      const numeros = res.data.map(f => parseInt(f.numeroFacture)).filter(n => !isNaN(n));
      const max = Math.max(0, ...numeros);
      const next = (max + 1).toString().padStart(6, "0");
      setNumeroFacture(next);
    } catch (err) {
      console.error("❌ Erreur lors de la génération du numéro :", err);
    }
  };

  const handleClientCreated = (newClient) => {
    axios.get("/api/clients").then((res) => setClients(res.data));
    setClientId(newClient._id);
    setClientInput(`${newClient.nom} ${newClient.prenom} - ${newClient.societe}`);
    setShowClientForm(false);
  };

  useEffect(() => {
    const init = async () => {
      const [clientsRes, produitsRes, servicesRes] = await Promise.all([
        axios.get("/api/clients"),
        axios.get("/api/produits"),
        axios.get("/api/services"),
      ]);

      setClients(clientsRes.data);
      setProduits(produitsRes.data);
      setServices(servicesRes.data);

      if (editData?.client) {
        const clientObj = typeof editData.client === "object"
          ? editData.client
          : clientsRes.data.find(c => c._id === editData.client);

        if (clientObj) {
          setClientId(clientObj._id);
          setClientInput(`${clientObj.nom} ${clientObj.prenom} - ${clientObj.societe || ""}`.trim());
        }
      } else if (editData?.clientInput) {
        setClientInput(editData.clientInput);
      }

      if (editData?.numeroFacture) {
        setNumeroFacture(editData.numeroFacture);
      } else {
        await generateNumeroFacture();
      }
    };

    init();
  }, [editData]);
// ✅ Conversion lignes → ajout inputValue sans dépendre de "lignes"
useEffect(() => {
  const lignesToUpdate = [...lignes];

  if ((produits.length || services.length) && lignesToUpdate.length) {
    const combinedOptions = [
      ...produits.map(p => ({ _id: p._id, type: "produit", nom: p.reference, prix: p.prixVente })),
      ...services.map(s => ({ _id: s._id, type: "service", nom: s.nom, prix: s.tarif })),
    ];

    const lignesAvecInput = lignesToUpdate.map((ligne) => {
      if (ligne.inputValue) return ligne;
      const match = combinedOptions.find(
        (opt) => opt._id === ligne.itemId && opt.type === ligne.type
      );
      return {
        ...ligne,
        inputValue: match ? match.nom : ligne.designation // ✅ seulement le nom
      };
    });

    setLignes(lignesAvecInput);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [produits, services]);



  const options = [
    ...produits.map(p => ({ _id: p._id, type: "produit", nom: p.reference, prix: p.prixVente })),
    ...services.map(s => ({ _id: s._id, type: "service", nom: s.nom, prix: s.tarif })),
  ];

  const handleClientInput = (e) => {
    const val = e.target.value;
    setClientInput(val);
  
    const match = clients.find(
      (c) => `${c.nom} ${c.prenom} - ${c.societe}`.toLowerCase() === val.toLowerCase()
    );
  
    if (match) {
      setClientId(match._id);
      setClientInput(`${match.nom} ${match.prenom} `);
      setNomEntreprise(match.societe); // Remplir le champ entreprise
      setTelephone(match.telephone || ""); // Remplir le champ téléphone
    } else {
      setClientId("");
      setNomEntreprise(""); // Réinitialiser entreprise
      setTelephone(""); // Réinitialiser téléphone
    }
  };
  

  const handleSelectItem = (index, value) => {
    const selected = options.find(opt => opt.nom === value); // 🔧 seulement par nom
    const updated = [...lignes];
  
    if (selected) {
      const produitComplet = produits.find(p => p._id === selected._id);
  
      if (selected.type === "produit" && produitComplet && produitComplet.stockActuel === 0) {
        alert(`⚠️ Le produit "${produitComplet.reference}" est en rupture de stock !`);
      }
  
      updated[index] = {
        ...updated[index],
        itemId: selected._id,
        type: selected.type,
        designation: selected.nom,
        prixUnitaire: selected.prix, // 🔥 rempli automatiquement
        inputValue: selected.nom     // ✅ afficher uniquement le nom
      };
    } else {
      updated[index].inputValue = value;
    }
  
    setLignes(updated);
  };
  

  const handleChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = field === "designation" ? value : parseFloat(value) || 0;
    setLignes(updated);
  };

  const ajouterLigne = () => {
    setLignes([...lignes, { itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]);
  };

  const supprimerLigne = (index) => {
    const updated = [...lignes];
    updated.splice(index, 1);
    setLignes(updated);
  };

  const subtotal = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
  const remiseMontant = subtotal * (remise / 100);
  const tax = (subtotal - remiseMontant) * (tvaRate / 100);
  const total = subtotal - remiseMontant + tax;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    if (!clientId || clientId.length < 10) {
      alert("❌ Le client sélectionné est invalide !");
      setIsSubmitting(false);
      return;
    }
  
    if (!reference.trim()) {
      alert("Référence requise !");
      setIsSubmitting(false);
      return;
    }
  
    if (telephone.length !== 8 || !/^[0-9]{8}$/.test(telephone)) {
      alert("Téléphone invalide (8 chiffres) !");
      setIsSubmitting(false);
      return;
    }
  
    const facture = {
      client: clientId,
      date,
      numeroFacture,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      tvaRate,
      remise,
      nomEntreprise,
      telephone,
      envoyée: true,
      logo,
      ...(editData?.devisId && { devisId: editData.devisId }),
    };
  
    try {
      const res = editData?._id
        ? await axios.put(`/api/factures/${editData._id}`, facture)
        : await axios.post("/api/factures", facture);
  
      alert("✅ Facture enregistrée !");
      onAddFacture(res.data, true); // ✅ on signale qu’elle est déjà créée
      onCancel();
    } catch (err) {
      console.error("❌ Erreur lors de l'enregistrement :", err);
      alert("Erreur lors de l'enregistrement !");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const handlePrint = async () => {
    const logoURL = logo
      ? typeof logo === "string"
        ? logo
        : await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logo);
          })
      : "";
  
    const clientInfo = clients.find(c => c._id === clientId);
  
    const html = `
    <html>
      <head>
        <title>Facture ${numeroFacture}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 60px; color: #2f3e4d; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
          .client-info-logo { display: flex; gap: 20px; align-items: center; }
          .client-info-logo img { max-width: 80px; max-height: 80px; border-radius: 6px; border: 1px solid #ccc; }
          .section-title { font-weight: 600; margin-bottom: 5px; font-size: 14px; }
          .info, .facture-info { font-size: 16px; line-height: 1.6; }
          .info-blocks { display: flex; justify-content: space-between; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 15px; }
          th { background-color: #f2f4f6; color: #4b5563; padding: 12px; border-bottom: 2px solid #e5e7eb; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          .totals { margin-top: 40px; text-align: right; font-size: 16px; }
          .totals p { margin: 5px 0; }
          .total-amount { font-size: 20px; font-weight: bold; }
          .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="client-info-logo">
            ${logoURL ? `<img src="${logoURL}" alt="Logo client">` : ""}
            <div>
              <div class="section-title">Client</div>
              <div class="info">
                ${clientInfo?.nom || "Client"} ${clientInfo?.prenom || ""}<br/>
                ${nomEntreprise || ""}
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <strong>Ganesh Coding</strong><br/>
            25140235<br/>
            Beb bhar
          </div>
        </div>
        <div class="info-blocks">
          <div class="facture-info">
            <div class="section-title">Date de facture</div>
            ${date}
          </div>
          <div class="facture-info">
            <div class="section-title">N° Facture</div>
            ${numeroFacture}
          </div>
          <div class="facture-info">
            <div class="section-title">Référence</div>
            ${reference}
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Désignation</th><th style="text-align:center;">Prix unitaire</th><th style="text-align:center;">Quantité</th><th style="text-align:right;">Total ligne</th></tr>
          </thead>
          <tbody>
            ${lignes.map(ligne => `
              <tr>
                <td>${ligne.designation}</td>
                <td style="text-align:center;">${ligne.prixUnitaire.toFixed(3)} TND</td>
                <td style="text-align:center;">${ligne.quantite}</td>
                <td style="text-align:right;">${(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="totals">
          <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
          <p><strong>Remise (${remise}%):</strong> ${(subtotal * remise / 100).toFixed(3)} TND</p>
          <p><strong>TVA (${tvaRate}%):</strong> ${tax.toFixed(3)} TND</p>
          <p class="total-amount"><strong>Total :</strong> ${total.toFixed(3)} TND</p>
        </div>
        <div class="footer">Merci pour votre confiance – Facterli</div>
      </body>
    </html>
    `;
  
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };
  

  
  

  return (
    <div className="container-fluid ">
  <div className="row">
            <div className="row">
              {/* 🧾 Zone 75% contenu facture */}
              <div className="col-md-9" ref={printRef}>
              <h4 className="mb-3">{editData && editData._id ? "Modifier facture" : "Nouvelle facture"}</h4>

  
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="border rounded d-flex align-items-center justify-content-center position-relative"
                      style={{ height: "100px", borderStyle: "dashed", overflow: "hidden" }}>
                      <input type="file" accept="image/*"
                        onChange={handleLogoUpload}
                        style={{ opacity: 0, position: "absolute", width: "100%", height: "100%" }} />
                      {logo
                        ? <img src={typeof logo === "string" ? logo : URL.createObjectURL(logo)} alt="Logo"
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                        : <span className="text-muted small text-center">Drag logo here<br />or select file</span>}
                    </div>
                  </div>
  
                  <div className="col-md-5">
                    <input className="form-control mb-2" placeholder="Entreprise"
                      value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
                    <input
                      className="form-control"
                      placeholder="Téléphone"
                      value={telephone}
                      maxLength={8}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,8}$/.test(val)) setTelephone(val);
                      }}
                      onBlur={() => {
                        if (telephone.length !== 8) {
                          alert("📱 Le numéro de téléphone doit contenir exactement 8 chiffres !");
                          setTelephone("");
                        }
                      }}
                    />
                  </div>
  
                  {/* 👉 Infos entreprise fixes à droite */}
                  <div className="col-md-4 d-flex flex-column justify-content-center align-items-end text-end">
                    <strong>Ganesh Coding</strong>
                    <small>25140235</small>
                    <small>Beb bhar</small>
                  </div>
                </div>
  
                {/* Client input dynamique */}
                <div className="mb-3">
                  <label>Client</label>
                  <input
                    className="form-control"
                    list="clients"
                    placeholder="Rechercher un client..."
                    value={clientInput}
                    onChange={handleClientInput}
                  />
                  <datalist id="clients">
                    {clients.map(c => (
                      <option key={c._id} value={`${c.nom} ${c.prenom} - ${c.societe}`} />
                    ))}
                  </datalist>
  
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => setShowClientForm(true)}
                  >
                    + Créer un client
                  </button>
  
                  {/* Modal d’ajout de client */}
                  {showClientForm && (
                    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}>
                      <div className="modal-dialog modal-dialog-centered" style={{ marginTop: "100px" }}>
                        <div className="modal-content p-3">
                          <div className="modal-header">
                            <h5 className="modal-title">Nouveau client</h5>
                            <button className="btn-close" onClick={() => setShowClientForm(false)}></button>
                          </div>
                          <div className="modal-body">
                            <ClientForm
                              onClientCreated={handleClientCreated}
                              onClose={() => setShowClientForm(false)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Suite (date, numéro, référence) */}
                <div className="row mb-3">
                  <div className="col">
                    <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="col">
                    <input type="text" className="form-control" value={numeroFacture} disabled />
                  </div>
                  <div className="col">
                    <input type="text" className="form-control" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </div>
                </div>

                {/* Lignes */}
                <div className="table-responsive mb-3">
                  <table className="table table-bordered">
                    <thead><tr><th>Produit / Service</th><th>Quantité</th><th>PU</th><th>Total</th><th></th></tr></thead>
                    <tbody>
                      {lignes.map((ligne, i) => (
                        <tr key={i}>
                          <td>
                            <input
                              list={`options-${i}`}
                              className="form-control"
                              placeholder="Produit ou service..."
                              value={ligne.inputValue || ""}
                              onChange={(e) => handleSelectItem(i, e.target.value)}
                            />
                            <datalist id={`options-${i}`}>
                              {options.map(opt => (
                                <option key={opt._id} value={opt.nom} />

                              ))}
                            </datalist>
                          </td>
                          <td><input type="number" className="form-control" value={ligne.quantite} onChange={(e) => handleChange(i, "quantite", e.target.value)} /></td>
                          <td><input type="number" className="form-control" value={ligne.prixUnitaire} onChange={(e) => handleChange(i, "prixUnitaire", e.target.value)} /></td>
                          <td>{(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
                          <td><button className="btn btn-link text-danger" onClick={() => supprimerLigne(i)}><FaTrash /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className="btn btn-outline-primary" onClick={ajouterLigne}>+ Ajouter une ligne</button>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <label>Remise (%)</label>
                    <input type="number" className="form-control" value={remise} onChange={(e) => setRemise(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-4">
                    <label>TVA (%)</label>
                    <input type="number" className="form-control" value={tvaRate} onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-md-4 text-end">
                    <p><strong>Sous-total :</strong> {subtotal.toFixed(3)} TND</p>
                    <p><strong>Remise :</strong> {remiseMontant.toFixed(3)} TND</p>
                    <p><strong>TVA :</strong> {tax.toFixed(3)} TND</p>
                    <h5><strong>Total :</strong> {total.toFixed(3)} TND</h5>
                  </div>
                </div>
              </div>

              {/* 📎 Zone 25% boutons */}
              <div className="col-md-3 d-flex flex-column align-items-end justify-content-center gap-2">
              {/* ✅ Bouton Enregistrer / Mettre à jour */}
<button
  className="btn shadow-sm rounded-pill fw-bold px-4 py-2"
  style={{
    backgroundColor: editData && editData._id ? "#ffc107" : "#23BD15",
    borderColor: editData && editData._id ? "#ffc107" : "#23BD15",
    color: "#fff",
    minWidth: "150px",
  }}
  onClick={handleSave}
  disabled={isSubmitting}
>
  {isSubmitting
    ? "Enregistrement..."
    : editData && editData._id
    ? "Mettre à jour"
    : "Envoyer"}
</button>

{/* ✅ Bouton Imprimer */}
<button
  className="btn btn-outline-dark shadow-sm rounded-pill fw-bold px-4 py-2"
  style={{ minWidth: "150px" }}
  onClick={handlePrint}
>
  <FaPrint className="me-2" />
  Imprimer
</button>

{/* ✅ Bouton Annuler */}
<button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-pill"
              style={{ fontWeight: "bold", minWidth: "150px" }}
            >
              Annuler
            </button>     

                            </div>
                          </div>
                          
          </div>
        </div>
      
  );
};

export default FactureForm;