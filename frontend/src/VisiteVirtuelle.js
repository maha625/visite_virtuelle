import React, { useEffect, useState } from "react";
import "pannellum/build/pannellum.css";

export default function VisiteVirtuelle({ currentScene }) {
  const [scenes, setScenes] = useState(null);

  // Charger les scènes depuis l'API
  useEffect(() => {
    fetch("http://localhost:5000/scenes")
      .then(res => res.json())
      .then(data => setScenes(data))
      .catch(err => console.error("Erreur chargement scènes:", err));
  }, []);

  // Initialisation Pannellum
  useEffect(() => {
    if (!scenes) return;

    const initViewer = () => {
      const container = document.getElementById("panorama");
      if (!container) return;

      // Vérifier que toutes les scènes ont un panorama valide
      const validScenes = {};
      for (const key in scenes) {
        if (scenes[key].panorama) validScenes[key] = scenes[key];
        else console.warn(`Scene "${key}" n'a pas de panorama défini`);
      }

      if (!window.viewer && window.pannellum) {
        window.viewer = window.pannellum.viewer("panorama", {
          default: {
            firstScene: Object.keys(validScenes)[0] || "",
            author: "Maha El Allam",
            sceneFadeDuration: 1000,
            autoLoad: true,
            showControls: false,
          },
          scenes: validScenes,
        });
      }

      // Charger la scène demandée
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

  // Changer de scène si currentScene change après l'initialisation
  useEffect(() => {
    if (window.viewer && currentScene && window.viewer.getScene() !== currentScene) {
      window.viewer.loadScene(currentScene);
    }
  }, [currentScene]);

  return (
    <div
      id="panorama"
      style={{
        width: "100%",
        height: "90vh",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
