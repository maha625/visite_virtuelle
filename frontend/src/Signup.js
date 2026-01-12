import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import profileIcon from "./autre_image/profil.png";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirm) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'inscription.");
        return;
      }

      // Inscription réussie → sauvegarde du token et redirection
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Impossible de s'inscrire. Serveur indisponible.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src={profileIcon} alt="Avatar" className="signup-avatar" />
        <h2>Créer un compte</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Nom complet</label>
          <input
            type="text"
            placeholder="Ton nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Mot de passe</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choisissez un mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Afficher le mot de passe"
              role="button"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.12 10.12 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 5.06-6.36"></path>
                  <path d="M1 1l22 22"></path>
                </svg>
              )}
            </span>
          </div>

          <label>Confirmer le mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmez le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="confirm-input"
          />

          {error && <div className="signup-error" role="alert">{error}</div>}

          <button type="submit" className="signup-btn">S'inscrire</button>
        </form>

        <p className="signup-footer">
          Déjà inscrit ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
