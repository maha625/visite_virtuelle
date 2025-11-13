import React from "react";
import { ReactComponent as CarteSVG } from "./2D/Frame8.svg";
import "./Carte.css";

export default function Carte({ onDepartementClick }) {
  const handleClick = (event) => {
    // On cherche l'élément avec l'attribut data-departement
    const departementEl = event.target.closest("[data-departement]");

    if (departementEl) {
      const departement = departementEl.getAttribute("data-departement");
      console.log("Département cliqué :", departement);

      // Déclenche le changement de scène
      onDepartementClick(departement);

      // 👇 Fait défiler la page jusqu’à la section "Visite Virtuelle"
      const section = document.getElementById("galerie");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="carte-container">
      <CarteSVG className="carte-svg" onClick={handleClick} />
    </div>
  );
}
