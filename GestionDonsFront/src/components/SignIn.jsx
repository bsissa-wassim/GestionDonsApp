import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Auth.css";

const SignIn = ({ onBack, onSwitchToSignUp, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Connexion réussie !" });
        // Call onLoginSuccess if provided
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Retour
        </button>
        <div className="auth-logo">
          <img src="/logo - Copy.png" alt="Donarise" />
        </div>
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Bienvenue ! Connectez-vous à votre compte.</p>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" className="forgot-password">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <button className="social-btn google">
            <i className="fab fa-google"></i> Google
          </button>
          <button className="social-btn facebook">
            <i className="fab fa-facebook-f"></i> Facebook
          </button>
        </div>

        <p className="auth-switch">
          Pas encore de compte ?{" "}
          <button className="auth-link" onClick={onSwitchToSignUp}>S'inscrire</button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
