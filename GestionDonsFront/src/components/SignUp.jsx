import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Auth.css";

const SignUp = ({ onBack, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Les mots de passe ne correspondent pas" });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "error", text: "Le mot de passe doit contenir au moins 6 caractères" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else if (data.user) {
        // Insert into profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            nom: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            roles: ['user']
          });

        if (profileError) {
          console.error("Profile error:", profileError);
          setMessage({ type: "error", text: "Erreur lors de la création du profil: " + profileError.message });
        } else {
          setMessage({ type: "success", text: "Inscription réussie ! Vérifiez votre email pour confirmer votre compte." });
          setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
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
      <div className="auth-card signup-card">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Retour
        </button>
        <div className="auth-logo">
          <img src="/logo - Copy.png" alt="Donarise" />
        </div>
        <h1 className="auth-title">Créer un compte</h1>
        
        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Prénom"
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
                placeholder="Nom"
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
          
          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="terms">
            <input type="checkbox" required />
            <span>J'accepte les <a href="#">conditions</a></span>
          </label>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        
        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-auth">
          <button className="social-btn google">
            <i className="fab fa-google"></i>
          </button>
          <button className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
          </button>
        </div>
        
        <p className="auth-switch">
          Déjà un compte ?{" "}
          <button className="auth-link" onClick={onSwitchToSignIn}>Se connecter</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
