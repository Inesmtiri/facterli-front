import React, { useEffect, useState } from "react";
import { FaTrash, FaPrint } from "react-icons/fa";

import axios from "axios";
import ClientForm from "../ClientForm";

const DevisForm = ({ onAddDevis, onCancel, editData }) => {
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);
  const [clientId, setClientId] = useState(editData?.clientId || "");
  const [clientInput, setClientInput] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [adresse] = useState("beb bhar");
  const [telephone, setTelephone] = useState("");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroDevis, setNumeroDevis] = useState("");
  const [reference, setReference] = useState(editData?.reference || "");
  const [logo, setLogo] = useState(editData?.logo || null);
 
   useEffect(() => {
     if (editData?.logo) {
       setLogo(editData.logo);
     }
   }, [editData]);
  const [tva, setTva] = useState(19);
  const [discount, setDiscount] = useState(0);
  const [showClientForm, setShowClientForm] = useState(false);
  const [lignes, setLignes] = useState(
    editData?.lignes || [{ itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "" }]
  );
  // Ajoute ce useEffect au bon endroit après useState
  useEffect(() => {
    if (editData && editData.lignes) {
      setNomEntreprise(editData.nomEntreprise || "");
      setTelephone(editData.telephone || "");
      setClientId(editData.clientId || "");
      setClientInput(editData.client || "");
      setNumeroDevis(editData.numeroDevis || "");
      setReference(editData.reference || "");
      setDiscount(editData.discount || 0);
      setTva(editData.tax && editData.subtotal ? (editData.tax * 100) / editData.subtotal : 19);

      const lignesModifiees = editData.lignes.map((l) => ({
        ...l,
        inputValue: `${l.designation} - ${l.prixUnitaire}`,
      }));
      setLignes(lignesModifiees);

      if (editData?.logo) {
        setLogo(editData.logo);
      }
      
    } else {
      // Cas d'ajout : initialisation avec une ligne vide si pas de devis à éditer
      setLignes([{ itemId: "", type: "", quantite: 1, prixUnitaire: 0, designation: "", inputValue: "" }]);
    }
  }, [editData]);


  useEffect(() => {
    fetchClients();
    axios.get("/api/produits").then((res) => setProduits(res.data));
    axios.get("/api/services").then((res) => setServices(res.data));

    if (!editData) {
      generateNumeroDevis(); // Appelle uniquement en mode création
    }
  }, [editData]);


  const fetchClients = () => {
    axios.get("/api/clients").then((res) => setClients(res.data));
  };

  const generateNumeroDevis = () => {
    axios.get("/api/devis").then((res) => {
      const numeros = res.data
        .map((d) => parseInt(d.numeroDevis))
        .filter((n) => !isNaN(n));
      const max = Math.max(0, ...numeros);
      const next = (max + 1).toString().padStart(6, "0");
      setNumeroDevis(next);
    });
  };


  const options = [
    ...produits.map((p) => ({ _id: p._id, type: "produit", nom: p.reference, prix: p.prixVente })),
    ...services.map((s) => ({ _id: s._id, type: "service", nom: s.nom, prix: s.tarif })),
  ];

 

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
  const discountAmount = subtotal * (discount / 100);
  const tax = (subtotal - discountAmount) * (tva / 100);
  const total = subtotal - discountAmount + tax;
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  
    const handleSave = async () => {
      if (!clientId) return alert("Veuillez sélectionner un client.");
    
      let logoData = logo;
    
      // ⚡ Si c'est un fichier, le transformer en base64
      if (logo instanceof File) {
        logoData = await toBase64(logo);
      }
    
      const devis = {
        clientId,
        client: clients.find(c => c._id === clientId)?.nom + " " + clients.find(c => c._id === clientId)?.prenom,
        nomEntreprise,
        adresse,
        telephone,
        date,
        numeroDevis,
        reference,
        lignes,
        subtotal,
        tax,
        total,
        discount,
        statut: "en attente",
        logo: logoData || "", // ✅ Base64 ou chaîne vide
      };
    
      try {
        const res = editData?._id
          ? await axios.put(`/api/devis/${editData._id}`, devis)
          : await axios.post("/api/devis", devis);
    
        onAddDevis(res.data);
        onCancel();
      } catch (err) {
        alert("Erreur lors de l'enregistrement.");
        console.error(err.message);
      }
    };
    


  const handleClientCreated = (newClient) => {
    fetchClients();
    setClientId(newClient._id);
    setShowClientForm(false);
  };
  const handlePrint = () => {
    const logoURL = logo
      ? typeof logo === "string"
        ? logo
        : URL.createObjectURL(logo)
      : "";
  
    const html = `
    <html>
      <head>
        <title>Devis ${numeroDevis}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 60px;
            color: #2f3e4d;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .client-info-logo {
            display: flex;
            gap: 20px;
            align-items: center;
          }
          .logo-container {
            width: 80px;
            height: 80px;
            border: 1px solid #ccc;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f9f9f9;
          }
          .logo-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .section-title {
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 14px;
          }
          .info, .devis-info {
            font-size: 16px;
            line-height: 1.6;
          }
          .info-blocks {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
            font-size: 15px;
          }
          th {
            background-color: #f2f4f6;
            color: #4b5563;
            padding: 12px;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .totals {
            margin-top: 40px;
            text-align: right;
            font-size: 16px;
          }
          .totals p {
            margin: 5px 0;
          }
          .total-amount {
            font-size: 20px;
            font-weight: bold;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            color: #9ca3af;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="client-info-logo">
            ${
              logoURL
                ? `<div class="logo-container"><img src="${logoURL}" alt="Logo client" /></div>`
                : ""
            }
            <div>
              <div class="section-title">Client</div>
              <div class="info">
                ${clientInput || "Nom du client"}<br/>
                ${nomEntreprise || ""}<br/>
                ${telephone || ""}
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
          <div class="devis-info">
            <div class="section-title">Date du devis</div>
            ${date}
          </div>
          <div class="devis-info">
            <div class="section-title">Numéro du devis</div>
            ${numeroDevis}
          </div>
        </div>
  
        <table>
          <thead>
            <tr>
              <th>Désignation</th>
              <th style="text-align:center;">Prix unitaire</th>
              <th style="text-align:center;">Quantité</th>
              <th style="text-align:right;">Total ligne</th>
            </tr>
          </thead>
          <tbody>
            ${lignes
              .map(
                (ligne) => `
              <tr>
                <td>${ligne.designation}</td>
                <td style="text-align:center;">${ligne.prixUnitaire.toFixed(
                  3
                )} TND</td>
                <td style="text-align:center;">${ligne.quantite}</td>
                <td style="text-align:right;">${(
                  ligne.quantite * ligne.prixUnitaire
                ).toFixed(3)} TND</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
  
        <div class="totals">
          <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
          <p><strong>Remise (${discount}%):</strong> ${discountAmount.toFixed(
      3
    )} TND</p>
          <p><strong>TVA (${tva}%):</strong> ${tax.toFixed(3)} TND</p>
          <p class="total-amount"><strong>Total :</strong> ${total.toFixed(
            3
          )} TND</p>
        </div>
  
        <div class="footer">
          Merci pour votre confiance – Facterli
        </div>
      </body>
    </html>
    `;
  
    const printWindow = window.open("", "_blank", "width=900,height=600");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  

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


  return (
    
    <div className="container-fluid mt-4 px-5">
  <h4 className="mb-4">{editData ? "Modifier devis" : "Nouveau devis"}</h4>

            <div className="row">
              {/* ✅ Contenu devis 75% */}
              <div className="col-md-9">
                {/* Logo + entreprise */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div
                      className="border rounded d-flex align-items-center justify-content-center position-relative"
                      style={{ height: "100px", borderStyle: "dashed", overflow: "hidden" }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogo(e.target.files[0])}
                        style={{
                          opacity: 0,
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                        }}
                      />
                     {logo ? (
  <img
    src={
      typeof logo === "string"
        ? logo.startsWith("data:")
          ? logo
          : `/uploads/${logo}`
        : URL.createObjectURL(logo)
    }
    alt="Logo"
    style={{
      maxHeight: "100%",
      maxWidth: "100%",
      objectFit: "contain",
    }}
  />
) : (
  <span className="text-center text-muted small">
    Drag logo here<br />
    or select a file
  </span>
)}

                    </div>
                  </div>


                  <div className="col-md-5">
                    <input className="form-control mb-2" placeholder="Entreprise" value={nomEntreprise} onChange={(e) => setNomEntreprise(e.target.value)} />
                    <input className="form-control" placeholder="Téléphone" value={telephone}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,8}$/.test(val)) setTelephone(val);
                      }}
                      onBlur={() => {
                        if (telephone.length !== 8) {
                          alert("Téléphone invalide");
                          setTelephone("");
                        }
                      }}
                    />
                  </div>
                  <div className="col-md-4 text-end small">
                    <strong>Ganesh Coding</strong><br />
                    25140235<br />
                    Beb bhar
                  </div>
                </div>

                {/* Client */}
                <div className="mb-3">
                  <label className="fw-semibold">Client</label>
                  <input
                    type="text"
                    list="clients"
                    className="form-control"
                    placeholder="Rechercher ou sélectionner un client..."
                    value={clientInput}
                    onChange={handleClientInput}
                  />
                  <datalist id="clients">
                    {clients.map((c) => (
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
  
                </div>

                {/* Infos devis */}
                <div className="row mb-3">
                  <div className="col"><label>Date</label><input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                  <div className="col"><label>Numéro</label><input type="text" className="form-control" value={numeroDevis} disabled /></div>
                  <div className="col"><label>Référence</label><input type="text" className="form-control" value={reference} onChange={(e) => setReference(e.target.value)} /></div>
                  <div className="col-2"><label>TVA (%)</label><input type="number" className="form-control" value={tva} onChange={(e) => setTva(parseFloat(e.target.value))} /></div>
                </div>

                {/* Lignes */}
                <div className="table-responsive mb-3">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Produit / Service</th>
                        <th>Quantité</th>
                        <th>Prix Unitaire</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignes.map((ligne, i) => (
                        <tr key={i}>
                          <td>
                            <input
                              className="form-control"
                              list={`options-${i}`}
                              placeholder="Produit ou service..."
                              value={lignes[i].inputValue || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const selected = options.find((opt) => `${opt.nom} - ${opt.prix}` === value);

                                const updated = [...lignes];
                                if (selected) {
                                  updated[i] = {
                                    ...updated[i],
                                    itemId: selected._id,
                                    type: selected.type,
                                    prixUnitaire: selected.prix,
                                    designation: selected.nom,
                                    inputValue: value,
                                  };
                                } else {
                                  updated[i].inputValue = value;
                                }
                                setLignes(updated);
                              }}
                            />
                            <datalist id={`options-${i}`}>
                              {options.map((opt) => (
                                <option key={opt._id} value={`${opt.nom} - ${opt.prix}`} />
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

                {/* Remise & Totaux */}
                <div className="row">
                  <div className="col-md-4">
                    <label>Remise (%)</label>
                    <input type="number" className="form-control" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value))} />
                  </div>
                  <div className="col-md-8 text-end">
                    <p><strong>Subtotal :</strong> {subtotal.toFixed(3)} TND</p>
                    <p><strong>Remise ({discount}%):</strong> {discountAmount.toFixed(3)} TND</p>
                    <p><strong>Tax ({tva}%):</strong> {tax.toFixed(3)} TND</p>
                    <h5><strong>Total :</strong> {total.toFixed(3)} TND</h5>
                  </div>
                </div>
              </div>

              {/* ✅ Boutons à droite */}
              <div className="col-md-3 d-flex flex-column align-items-end justify-content-center gap-2">
              <div className="col-md-3 d-flex flex-column align-items-end justify-content-center gap-2">
  <button
    className="btn shadow-sm rounded-pill fw-bold px-4 py-2"
    style={{
      backgroundColor: editData ? "#ffc107" : "#23BD15",
      borderColor: editData ? "#ffc107" : "#23BD15",
      color: "#fff",
      minWidth: "150px",
    }}
    onClick={handleSave}
  >
    {editData ? "Mettre à jour" : "Envoyer"}
  </button>
</div>

                <button
  className="btn btn-outline-dark px-4 py-2 shadow-sm rounded-pill fw-bold"
  style={{ minWidth: "150px" }}
  onClick={handlePrint}
>
  <FaPrint className="me-2" />
  Imprimer
</button>

                <button
              type="button"
              onClick={onCancel}
              className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-pill"
              style={{ fontWeight: "bold", minWidth: "150px" }}
            >
              Annuler
            </button>              </div>
            </div>
          
            {showClientForm && <ClientForm onClose={() => setShowClientForm(false)} onSave={handleClientCreated} />}
          </div>
        
  );
};

export default DevisForm;

