import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { Annotation } from './models/Annotation.js';
import { scenes } from './scenes.js';
import { NlpManager } from 'node-nlp';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const LLM_MODEL = "openai/gpt-oss-20b:groq";
const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/projet_d'initiation")
  .then(() => console.log('✅ MongoDB connecté à projet_d\'initiation'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// NLU
const manager = new NlpManager({ languages: ['fr'] });

const SCENE_TITLES = Object.values(scenes).map(s => s.title);
const MAPPING_SYNONYMES = {
  "entree": "entrée de l'école",
  "ecole": "entrée de l'école",
  "biblio": "Bibliothèque et Centre de Langue",
  "administration etudiants": "Administration des étudiants",
  "maths info": "Departement math info",
  "td1": "Couloir TD1",
  "td2": "Couloir TD2",
  "amphi 3": "Entrée de Amphi 3",
  "salle de conference": "Salle de Conférence",
};

// Entraînement NLU
async function trainNlpManager() {
  manager.addDocument('fr', 'je veux aller à %lieu%', 'navigation.goto');
  manager.addDocument('fr', 'emmène-moi à %lieu%', 'navigation.goto');
  manager.addDocument('fr', 'vas à %lieu%', 'navigation.goto');
  manager.addDocument('fr', 'où est %lieu%', 'navigation.goto');
  manager.addDocument('fr', 'montre moi %lieu%', 'navigation.goto');

  manager.addDocument('fr', 'décris-moi %lieu%', 'info.describe');
  manager.addDocument('fr', 'parle-moi de %lieu%', 'info.describe');
  manager.addDocument('fr', 'quelles sont les infos sur %lieu%', 'info.describe');
  manager.addDocument('fr', 'détails de la scène', 'info.describe_current');
  manager.addDocument('fr', 'décris ici', 'info.describe_current');

  manager.addDocument('fr', 'où suis-je', 'info.whereami');
  manager.addDocument('fr', 'quelle est cette pièce', 'info.whereami');

  SCENE_TITLES.forEach(title => {
    manager.addNamedEntityText('lieu', title, ['fr'], [title.toLowerCase()]);
  });

  Object.entries(MAPPING_SYNONYMES).forEach(([synonym, targetTitle]) => {
    manager.addNamedEntityText('lieu', targetTitle, ['fr'], [synonym]);
  });

  console.log('⏳ Entraînement NLU...');
  await manager.train();
  console.log('✅ NLU prêt.');
}

// Appel LLM Hugging Face
async function queryLLM(prompt, currentSceneTitle) {
  if (!HUGGING_FACE_API_KEY) return "Erreur : Clé Hugging Face manquante.";

  const systemPrompt = `Tu es un guide virtuel d'une école d'ingénieurs. Tu es dans la scène : ${currentSceneTitle}. Réponds brièvement (2-3 phrases) à la question suivante :`;

  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      {
        model: LLM_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0]?.message?.content || "Pas de réponse du modèle.";
  } catch (err) {
    console.error("Erreur LLM HF :", err.response?.data || err.message);
    return "Erreur lors de la génération de la réponse.";
  }
}

// Récupérer l'ID de scène à partir du titre
function getSceneIdByTitle(title) {
  const normalized = title.toLowerCase();
  for (const [id, def] of Object.entries(scenes)) {
    if (def.title.toLowerCase() === normalized) return id;
  }
  return null;
}

// Traitement message
async function processChatRequest(message, currentSceneId) {
  const nluResult = await manager.process('fr', message);
  const intent = nluResult.intent;
  const confidence = nluResult.score;
  const currentSceneTitle = scenes[currentSceneId]?.title || "Lieu inconnu";

  // Si NLU faible -> LLM
  if (confidence < 0.5 || intent === 'None') {
    console.log(`💬 NLU faible (${confidence.toFixed(2)}), envoi au LLM...`);
    const llmReply = await queryLLM(message, currentSceneTitle);
    return { reply: llmReply };
  }

  const targetEntity = nluResult.entities.find(e => e.entity === 'lieu');
  const targetTitle = targetEntity ? targetEntity.option : null;
  let targetSceneId = targetTitle ? getSceneIdByTitle(targetTitle) : null;

  // Navigation
  if (intent === 'navigation.goto') {
    if (!targetSceneId) return { reply: `Lieu inconnu : ${targetTitle || 'demandé'}` };
    return { reply: `🚀 Direction : ${scenes[targetSceneId].title}`, command: { type: 'loadScene', sceneId: targetSceneId } };
  }

  // Description
  if (intent.startsWith('info.')) {
    targetSceneId = intent === 'info.describe_current' || intent === 'info.whereami' ? currentSceneId : targetSceneId;
    const annotation = await Annotation.findOne({ scene_id: targetSceneId });

    let reply = "";
    if (annotation) {
      const title = scenes[targetSceneId]?.title;
      reply = title ? `**${title} :**\n\n${annotation.annotation}` : annotation.annotation;
    } else {
      const title = scenes[targetSceneId]?.title;
      reply = title ? `Aucune annotation trouvée pour **${title}**.` : "Aucune annotation trouvée pour ce lieu.";
    }

    return { reply };
  }

  return { reply: "Je peux vous aider à naviguer ou décrire des lieux !" };
}

// API chat
app.post('/chat', async (req, res) => {
  const { message, currentSceneId } = req.body;
  if (!message || !currentSceneId) return res.status(400).json({ reply: "Message et currentSceneId requis." });

  try {
    const response = await processChatRequest(message, currentSceneId);
    res.json(response);
  } catch (err) {
    console.error("Erreur Chatbot :", err);
    res.status(500).json({ reply: "Erreur interne du serveur." });
  }
});

// Démarrage serveur
app.listen(PORT, async () => {
  if (!HUGGING_FACE_API_KEY) console.warn("⚠️ Clé Hugging Face non définie.");
  await trainNlpManager();
  console.log(`🚀 Serveur Express prêt sur http://localhost:${PORT}`);
});
