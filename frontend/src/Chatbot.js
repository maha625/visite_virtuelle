import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { scenes } from "./scenes";

const SCENE_TITLES = Object.fromEntries(
  Object.entries(scenes).map(([id, def]) => [id, def.title])
);

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([{ sender: "bot", text: "👋 Bienvenue dans la visite guidée !" }]);
  const [inputText, setInputText] = useState("");
  const [currentSceneId, setCurrentSceneId] = useState("entree_ecole");
  const chatEndRef = useRef();

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const appendMessage = (sender, text) => setMessages(prev => [...prev, { sender, text }]);

  useEffect(() => {
    const checkViewer = setInterval(() => {
      if (window.viewer) {
        setCurrentSceneId(window.viewer.getScene());
        window.viewer.on("scenechange", sid => {
          setCurrentSceneId(sid);
          appendMessage("bot", `✨ Vous êtes maintenant dans : **${SCENE_TITLES[sid] || 'Nouvelle Scène'}**`);
        });
        clearInterval(checkViewer);
      }
    }, 100);
    return () => clearInterval(checkViewer);
  }, []);

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

      if (data.command?.type === 'loadScene' && window.viewer) window.viewer.loadScene(data.command.sceneId);
      appendMessage("bot", data.reply || "Désolé, je n'ai pas compris.");

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
            <div dangerouslySetInnerHTML={{ __html: (msg.text || '').replace(/\n/g,'<br/>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>') }} />
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
