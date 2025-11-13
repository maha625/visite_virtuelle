import React, { useEffect } from "react";
import "pannellum/build/pannellum.css";
import "./VisiteVirtuelle.css";
import { scenes } from "./scenes";

export default function VisiteVirtuelle({ currentScene }) {
  // Si le viewer existe et que currentScene change : charger la scène
  useEffect(() => {
    if (window.viewer && currentScene) {
      try {
        // protection : n'appeler loadScene que si la scène existe dans scenes
        if (scenes[currentScene]) {
          window.viewer.loadScene(currentScene);
        } else {
          console.warn("VisiteVirtuelle: scène inconnue ->", currentScene);
        }
      } catch (e) {
        console.error("VisiteVirtuelle: erreur loadScene", e);
      }
    }
  }, [currentScene]);

  // Initialisation du script Pannellum (une seule fois)
  useEffect(() => {
    // si déjà chargé, on initialise directement
    const initViewer = () => {
      try {
        // sécurité : l'élément #panorama doit exister
        const container = document.getElementById("panorama");
        if (!container) {
          console.error("VisiteVirtuelle: #panorama introuvable dans le DOM");
          return;
        }

        // crée le viewer si pas encore créé
        if (!window.viewer && window.pannellum) {
          window.viewer = window.pannellum.viewer("panorama", {
            default: {
              firstScene: "entree_ecole",
              author: "Votre Nom",
              sceneFadeDuration: 1000,
              autoLoad: true,
              showControls: false,
              // showSceneControls peut être ignoré (on masquera en CSS ci-dessous)
            },
            scenes: scenes,
          });

          console.log("VisiteVirtuelle: pannellum viewer créé. scene actuelle :", window.viewer.getScene());
        }

        // si currentScene est fourni et différent de firstScene, charger la scène demandée
        if (window.viewer && currentScene && window.viewer.getScene() !== currentScene) {
          if (scenes[currentScene]) {
            window.viewer.loadScene(currentScene);
          } else {
            console.warn("VisiteVirtuelle: currentScene inconnu au moment de l'init ->", currentScene);
          }
        }
      } catch (err) {
        console.error("VisiteVirtuelle: erreur initViewer", err);
      }
    };

    if (!window.pannellum) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      // autoriser cross origin pour avoir erreurs lisibles (optionnel)
      script.crossOrigin = "anonymous";
      script.onload = () => {
        console.log("VisiteVirtuelle: script pannellum chargé");
        initViewer();
      };
      script.onerror = (e) => {
        console.error("VisiteVirtuelle: échec chargement script pannellum", e);
      };
      document.body.appendChild(script);

      // cleanup : on laisse pannellum disponible globalement, mais on retire le script si on démonte le composant
      return () => {
        // on ne détruit pas window.viewer ici pour garder l'état si tu navigues ailleurs ;
        // si tu veux forcer la destruction à la sortie, décommenter la ligne suivante:
        // if (window.viewer) { window.viewer.destroy(); delete window.viewer; }
        // supprime seulement le script DOM
        document.body.removeChild(script);
      };
    } else {
      // déjà chargé
      initViewer();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id="panorama" style={{ width: "100%", height: "90vh", borderRadius: "8px", overflow: "hidden" }} />;
}
