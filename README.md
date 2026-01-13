🌟 Présentation
Ce projet est une application web immersive permettant d'explorer le campus de l'ENSAM-Meknès à 360°. Il combine une navigation visuelle fluide avec un guide virtuel basé sur l'Intelligence Artificielle pour offrir une expérience interactive et informative.

🛠 Technologies Clés
Frontend : React.js pour l'interface, Pannellum pour le rendu des panoramas 360°, et SVG interactif pour la carte 2D.

Backend : Node.js avec Express, gérant la logique métier et la communication avec les APIs.

IA & NLP : NLP.js pour la détection d'intentions et l'API Hugging Face (LLM) pour la génération de réponses naturelles et contextuelles.

Base de Données : MongoDB Atlas pour le stockage dynamique des scènes, des points d'intérêt (hotspots) et des descriptions.

🚀 Fonctionnalités Principales
Exploration 360° : Navigation immersive entre les départements et infrastructures du campus.

Guide IA Conversationnel : Chatbot intelligent capable de comprendre le langage naturel, de corriger les fautes (Fuzzball) et de décrire les lieux en temps réel.

Carte Interactive : Plan dynamique en SVG permettant une téléportation instantanée vers n'importe quel point du campus.

Réponses Contextuelles : Grâce à l'architecture RAG (Retrieval-Augmented Generation), l'IA utilise les données de MongoDB pour fournir des informations officielles et précises.

📂 Architecture du Flux de Données
L'interaction utilisateur (clic ou message) est analysée par le serveur. Ce dernier extrait les informations pertinentes de MongoDB et les transmet à l'IA pour générer une réponse fluide ou déclencher une commande de navigation dans l'interface React.
Installation et Lancement
Cloner le dépôt :
git clone https://github.com/votre-repo/ensam-visit.git

Installer les dépendances :
npm install

Configurer les variables d'environnement (.env) :
HUGGING_FACE_API_KEY=votre_cle_api
MONGO_URI=votre_lien_mongodb

Lancer le projet :
npm start
node index
