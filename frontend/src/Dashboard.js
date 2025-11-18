import React, { useState, useRef } from "react";
import VisiteVirtuelle from "./VisiteVirtuelle";
import Carte from "./Carte";
import Chatbot from "./Chatbot";
import Header from "./Header";
import "./Dashboard.css";

export default function Dashboard() {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [currentScene, setCurrentScene] = useState("entree_ecole");
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "👋 Bienvenue dans la visite guidée !" }
  ]);

  const lastSceneRef = useRef(currentScene);

  const handleDepartementClick = (sceneId) => setCurrentScene(sceneId);
  const handleChatClick = () => setIsChatVisible(true);

  return (
    <>
      <Header onChatClick={handleChatClick} />

      <div className="dashboard-container">
        <div className="main-content" style={{ flex: isChatVisible ? 3 : 1 }}>
          <div className="section">
            <h2 id="galerie">🏠 Visite Virtuelle du Lieu</h2>
            <VisiteVirtuelle currentScene={currentScene} />
          </div>

          <div className="section">
            <h2 id="carte">📍 Localisation</h2>
            <Carte onDepartementClick={handleDepartementClick} />
          </div>
        </div>

        {isChatVisible && (
          <div className="sidebar">
            <Chatbot
              onClose={() => setIsChatVisible(false)}
              messages={chatMessages}
              setMessages={setChatMessages}
              currentSceneId={currentScene}
              lastSceneRef={lastSceneRef}
            />
          </div>
        )}
      </div>

      {!isChatVisible && (
        <div
          style={{
            width: "360px",
            cursor: "pointer",
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 20000,
          }}
          onClick={handleChatClick}
        >
          <button className="chatbot-show-btn">🤖</button>
        </div>
      )}
    </>
  );
}
