import express from "express";
import { Annotation } from "../models/Annotation.js";
import { NlpManager } from "node-nlp";
import axios from "axios";
import * as fuzz from "fuzzball"; // import ES Modules correct

import { loadScenesFromDB } from "../models/loadScenes.js";

const router = express.Router();
const manager = new NlpManager({ languages: ["fr"] });
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const LLM_MODEL = "openai/gpt-oss-20b:groq";
const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";

// --- Chargement des scènes une seule fois ---
let SCENES = {};
async function initializeScenes() {
  SCENES = await loadScenesFromDB();
  console.log("📌 Scènes chargées pour le chatbot :", Object.keys(SCENES).length);
}
initializeScenes();

// --- Entraînement NLU ---
async function trainNlpManager() {
  const SCENE_TITLES = Object.values(SCENES).map(s => s.title);

  // Commandes navigation
  manager.addDocument("fr", "je veux aller à %lieu%", "navigation.goto");
  manager.addDocument("fr", "emmène-moi à %lieu%", "navigation.goto");
  manager.addDocument("fr", "vas à %lieu%", "navigation.goto");
  manager.addDocument("fr", "où est %lieu%", "navigation.goto");
  manager.addDocument("fr", "montre moi %lieu%", "navigation.goto");

  // Commandes info
  manager.addDocument("fr", "décris-moi %lieu%", "info.describe");
  manager.addDocument("fr", "parle-moi de %lieu%", "info.describe");
  manager.addDocument("fr", "quelles sont les infos sur %lieu%", "info.describe");
  manager.addDocument("fr", "détails de la scène", "info.describe_current");
  manager.addDocument("fr", "décris ici", "info.describe_current");
  manager.addDocument("fr", "où suis-je", "info.whereami");
  manager.addDocument("fr", "quelle est cette pièce", "info.whereami");

  SCENE_TITLES.forEach(title => {
    manager.addNamedEntityText("lieu", title, ["fr"], [title.toLowerCase()]);
  });

  console.log("⏳ Entraînement NLU...");
  await manager.train();
  console.log("✅ NLU prêt.");
}

// --- LLM Hugging Face ---
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
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices?.[0]?.message?.content || "Pas de réponse du modèle.";
  } catch (err) {
    console.error("Erreur LLM HF :", err.response?.data || err.message);
    return "Erreur lors de la génération de la réponse.";
  }
}

// --- Traitement message sécurisé ---
async function processChatRequest(message, currentSceneId) {
  const currentSceneTitle = SCENES[currentSceneId]?.title;
  if (!currentSceneTitle) return { reply: "Lieu inconnu." };

  const nluResult = await manager.process("fr", message);
  const intent = nluResult.intent;
  const confidence = nluResult.score;

  // Si NLU faible -> LLM
  if (confidence < 0.5 || intent === "None") {
    const llmReply = await queryLLM(message, currentSceneTitle);
    return { reply: llmReply };
  }

  // 🔹 Détection du lieu avec sécurité + fuzzy matching
  let targetTitle = null;
  const targetEntity = nluResult.entities.find(e => e.entity === "lieu");

  if (targetEntity && targetEntity.option) {
    targetTitle = targetEntity.option;
  } else {
    // Fuzzy matching sur le texte complet si NLU n'a rien trouvé
    const allTitles = Object.values(SCENES).map(s => s.title);
    const results = fuzz.extract(message, allTitles, { scorer: fuzz.ratio, returnObjects: true });
    if (results.length > 0 && results[0].score > 60) {
      targetTitle = results[0].choice;
    }
  }

  const targetSceneId = targetTitle ? Object.keys(SCENES).find(id => SCENES[id].title === targetTitle) : null;

  // --- Navigation ---
  if (intent === "navigation.goto") {
    if (!targetSceneId) return { reply: `Lieu inconnu : ${targetTitle || "demandé"}` };
    return {
      reply: `✨ Vous êtes maintenant dans : ${SCENES[targetSceneId].title}`,
      command: { type: "loadScene", sceneId: targetSceneId }
    };
  }

  // --- Informations ---
  if (intent.startsWith("info.")) {
    const infoSceneId = intent === "info.describe_current" || intent === "info.whereami" ? currentSceneId : targetSceneId;
    const annotation = await Annotation.findOne({ scene_id: infoSceneId });
    const reply = annotation?.annotation || `Aucune annotation trouvée pour ce lieu.`;
    return { reply };
  }

  return { reply: "Je peux vous aider à naviguer ou décrire des lieux !" };
}

// --- Route chatbot ---
router.post("/", async (req, res) => {
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

// --- Démarrage NLU ---
trainNlpManager();

export default router;
