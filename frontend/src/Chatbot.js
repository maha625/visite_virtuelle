// src/Chatbot.js
import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Bienvenue dans la visite guidée !" }
  ]);
  const [inputText, setInputText] = useState("");
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [scenesMap, setScenesMap] = useState({});
  const lastSceneRef = useRef(null); // Dernière scène pour éviter doublons
  const chatEndRef = useRef();

  // Scroll automatique
  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // Charger les scènes depuis le backend
  useEffect(() => {
    fetch("http://localhost:5000/scenes")
      .then(res => res.json())
      .then(data => setScenesMap(data))
      .catch(err => console.error("Erreur chargement scènes:", err));
  }, []);

  // Initialiser la scène actuelle et écouter les changements
  useEffect(() => {
    const checkViewer = setInterval(() => {
      if (window.viewer) {
        const sid = window.viewer.getScene();
        setCurrentSceneId(sid);

        // Ajouter message uniquement si nouvelle scène
        if (lastSceneRef.current !== sid) {
          const title = scenesMap[sid]?.title || sid || "Nouvelle Scène";
          appendMessage("bot", `✨ Vous êtes maintenant dans : **${title}**`);
          lastSceneRef.current = sid;
        }

        // Écouter changement de scène
        window.viewer.on("scenechange", newSid => {
          setCurrentSceneId(newSid);
          if (lastSceneRef.current !== newSid) {
            const title = scenesMap[newSid]?.title || newSid || "Nouvelle Scène";
            appendMessage("bot", `✨ Vous êtes maintenant dans : **${title}**`);
            lastSceneRef.current = newSid;
          }
        });

        clearInterval(checkViewer);
      }
    }, 100);

    return () => clearInterval(checkViewer);
  }, [scenesMap]);

  const appendMessage = (sender, text) =>
    setMessages(prev => [...prev, { sender, text }]);

  // Envoi message au backend
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return appendMessage("bot", "⚠️ Veuillez écrire un message.");
    appendMessage("user", text);
    setInputText("");

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, currentSceneId })
      });

      if (!res.ok) return appendMessage("bot", `❌ Erreur serveur (${res.status})`);

      const data = await res.json();

      if (data.reply) appendMessage("bot", data.reply);

      // Si le backend demande de changer de scène
      if (data.command?.type === "loadScene" && data.command.sceneId && window.viewer) {
        window.viewer.loadScene(data.command.sceneId);
      }
    } catch (err) {
      appendMessage("bot", "❌ Erreur de connexion au serveur.");
      console.error(err);
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") handleSend(); };

  return (
    <div className="chatbot chatbot-animate">
      <div className="chatbot-header">
        🤖 Chat d’Assistance
        <button className="chatbot-min-btn" onClick={onClose}>-</button>
      </div>

      <div className="chatbot-body">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div
              dangerouslySetInnerHTML={{
                __html: (msg.text || '').replace(/\n/g,'<br/>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
              }}
            />
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Écrivez le nom du département..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}
