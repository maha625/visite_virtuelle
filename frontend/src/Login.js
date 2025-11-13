import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- ajouter Link
import "./Login.css";
import profileIcon from "./autre_image/profil.png";

export default function Login() {
  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("test");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const PROV_EMAIL = "test@gmail.com";
  const PROV_PASSWORD = "test";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === PROV_EMAIL && password === PROV_PASSWORD) {
      navigate("/dashboard");
    } else {
      setError("Identifiants incorrects. Utilisez test@gmail.com / test");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={profileIcon} alt="Profile" className="login-avatar" />
        <h2>Bienvenue !</h2>

        <form className="login-form" onSubmit={handleSubmit}>
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
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.12 10.12 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 5.06-6.36"></path>
                  <path d="M1 1l22 22"></path>
                </svg>
              )}
            </span>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button type="submit">Se connecter</button>
        </form>

        <p className="login-footer">
          Pas encore inscrit ?{" "}
          <Link to="/signup" className="signup-link">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
