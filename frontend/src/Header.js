import React from "react";
import "./Header.css";
import logoENSAM from "./autre_image/logoENSAM.png";
import profileImg from "./autre_image/profil.png"; // 👈 image de profil
import { useNavigate } from "react-router-dom"; // 👈 pour naviguer

export default function Header({ onChatClick }) {
  const navigate = useNavigate(); // 👈 hook pour changer de page

  const handleLogout = () => {
    // ici tu peux aussi vider le stockage local si tu gères une session :
    // localStorage.removeItem("user");
    navigate("/"); // 👈 redirige vers la page de connexion
  };

  return (
    <header className="header">
      {/* Logo */}
      <img src={logoENSAM} alt="ENSAM Logo" className="logo" />

      {/* Liens de navigation */}
      <nav className="nav">
        <a href="/Dashboard">Accueil</a>
        <a href="#galerie">Visite virtuelle</a>
        <a href="#carte">Carte</a>
        <a
          href="#chat"
          onClick={(e) => {
            e.preventDefault();
            if (onChatClick) onChatClick(); // ✅ Vérifie que la fonction existe
          }}
        >
          Chatbot
        </a>
      </nav>

      {/* Partie login et profil */}
      <div className="user-section">
        <button className="login-btn" onClick={handleLogout}>Log out → </button>
        <img
          src={profileImg}
          alt="Profil"
          className="profile-img"
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>
  );
}
