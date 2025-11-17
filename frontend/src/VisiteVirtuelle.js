import React, { useEffect, useState } from "react";
import "pannellum/build/pannellum.css";

export default function VisiteVirtuelle({ currentScene }) {
  const [scenes, setScenes] = useState(null);

  useEffect(() => {
    // Charger les scènes depuis l'API
    fetch("http://localhost:5000/scenes")
      .then(res => res.json())
      .then(data => setScenes(data))
      .catch(err => console.error("Erreur chargement scènes:", err));
  }, []);

  // Charger la scène quand currentScene change
  useEffect(() => {
    if (window.viewer && currentScene && scenes && scenes[currentScene]) {
      window.viewer.loadScene(currentScene);
    }
  }, [currentScene, scenes]);

  // Initialisation Pannellum
  useEffect(() => {
    if (!scenes) return;

    const initViewer = () => {
      const container = document.getElementById("panorama");
      if (!container) return;

      if (!window.viewer && window.pannellum) {
        window.viewer = window.pannellum.viewer("panorama", {
          default: {
            firstScene: Object.keys(scenes)[0],
            author: "Votre Nom",
            sceneFadeDuration: 1000,
            autoLoad: true,
            showControls: false,
          },
          scenes: scenes,
        });
      }

      if (window.viewer && currentScene && window.viewer.getScene() !== currentScene) {
        window.viewer.loadScene(currentScene);
      }
    };

    if (!window.pannellum) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onload = initViewer;
      document.body.appendChild(script);

      return () => document.body.removeChild(script);
    } else {
      initViewer();
    }
  }, [scenes, currentScene]);

  return (
    <div
      id="panorama"
      style={{ width: "100%", height: "90vh", borderRadius: "8px", overflow: "hidden" }}
    />
  );
}
