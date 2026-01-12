// src/profil/Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (storedUserStr && storedUserStr !== "undefined") {
      try {
        setUser(JSON.parse(storedUserStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null); // évite que JSON.parse(undefined) plante
    }
  }, []);

  if (!user) return <p>Chargement du profil...</p>;

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!oldPassword || !newPassword || !confirmPassword) return setMessage("Tous les champs sont requis.");
    if (newPassword !== confirmPassword) return setMessage("Les mots de passe ne correspondent pas.");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/auth/update-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur serveur.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/auth/delete-account", { headers: { Authorization: `Bearer ${token}` } });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <Header />
      <div className="profile-page-container">
        <h2>Profil de {user.fullName}</h2>
        <p className="profile-user-info"><strong>Email :</strong> {user.email}</p>

        <h3>Changer le mot de passe</h3>
        <form onSubmit={handleChangePassword} className="profile-password-form">
          <input type="password" placeholder="Ancien mot de passe" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <input type="password" placeholder="Confirmer nouveau mot de passe" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit">Modifier mot de passe</button>
        </form>

        <button className="profile-delete-btn" onClick={handleDeleteAccount}>Supprimer mon compte</button>
        {message && <p className="profile-message">{message}</p>}
      </div>
    </>
  );
}
