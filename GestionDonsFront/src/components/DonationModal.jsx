import React, { useState } from "react";
import "./DonationModal.css";

const DonationModal = ({ onClose }) => {
  const [donationType, setDonationType] = useState("money");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    amount: "",
    objectName: "",
    objectDescription: "",
    objectCondition: "bon",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Simulation d'envoi
    setTimeout(() => {
      setLoading(false);
      setMessage({ 
        type: "success", 
        text: donationType === "money" 
          ? "Merci pour votre don ! Vous recevrez un email de confirmation." 
          : "Merci ! Nous vous contacterons pour organiser la récupération de votre don."
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        amount: "",
        objectName: "",
        objectDescription: "",
        objectCondition: "bon",
        message: ""
      });
    }, 1500);
  };

  const predefinedAmounts = ["10", "25", "50", "100"];

  return (
    <div className="donation-overlay">
      <div className="donation-card">
        <button className="close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="donation-logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>

        <h1 className="donation-title">Faire un don</h1>
        <p className="donation-subtitle">Votre générosité fait la différence</p>

        {message.text && (
          <div className={`donation-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Type de don */}
        <div className="donation-type-selector">
          <button
            type="button"
            className={`type-btn ${donationType === "money" ? "active" : ""}`}
            onClick={() => setDonationType("money")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
              <path d="M12 18V6"></path>
            </svg>
            Don d'argent
          </button>
          <button
            type="button"
            className={`type-btn ${donationType === "object" ? "active" : ""}`}
            onClick={() => setDonationType("object")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Don d'objet
          </button>
        </div>

        <form className="donation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+216 XX XXX XXX"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {donationType === "money" ? (
            <>
              <div className="form-group">
                <label>Montant du don (TND)</label>
                <div className="amount-buttons">
                  {predefinedAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`amount-btn ${formData.amount === amt ? "active" : ""}`}
                      onClick={() => setFormData({ ...formData, amount: amt })}
                    >
                      {amt} TND
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Ou entrez un autre montant"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="objectName">Nom de l'objet</label>
                <input
                  type="text"
                  id="objectName"
                  name="objectName"
                  placeholder="Ex: Vêtements, Livres, Électroménager..."
                  value={formData.objectName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="objectCondition">État de l'objet</label>
                <select
                  id="objectCondition"
                  name="objectCondition"
                  value={formData.objectCondition}
                  onChange={handleChange}
                  required
                >
                  <option value="neuf">Neuf</option>
                  <option value="tres-bon">Très bon état</option>
                  <option value="bon">Bon état</option>
                  <option value="acceptable">Acceptable</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="objectDescription">Description</label>
                <textarea
                  id="objectDescription"
                  name="objectDescription"
                  placeholder="Décrivez brièvement l'objet (taille, couleur, quantité...)"
                  value={formData.objectDescription}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="message">Message (optionnel)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Un message à partager avec nous..."
              value={formData.message}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <label className="terms">
            <input type="checkbox" required />
            <span>J'accepte que mes données soient utilisées pour ce don</span>
          </label>

          <button type="submit" className="donation-btn" disabled={loading}>
            {loading ? (
              <span className="loading-text">
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeLinecap="round" />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              donationType === "money" ? "Confirmer le don" : "Soumettre mon don"
            )}
          </button>
        </form>

        <p className="donation-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Vos informations sont sécurisées
        </p>
      </div>
    </div>
  );
};

export default DonationModal;
