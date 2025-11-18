import express from "express";
import axios from "axios";
import * as fuzz from "fuzzball";
import { manager, SCENES, initNLU, normalize } from "../nluManager.js";
import { Annotation } from "../models/Annotation.js";
import { SYNONYMS } from "../models/synonyms.js";

const router = express.Router();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const LLM_MODEL = "openai/gpt-oss-20b:groq";
const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";

// --- LLM Hugging Face ---
async function queryLLM(prompt, currentSceneTitle) {
  if (!HUGGING_FACE_API_KEY) return "Erreur : Clé Hugging Face manquante.";

  const systemPrompt = `Tu es un guide virtuel dans la scène : ${currentSceneTitle}. Réponds brièvement :`;

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

// --- Traitement message ---
async function processChatRequest(message, currentSceneId) {
  const currentSceneTitle = SCENES[currentSceneId]?.title || "Lieu inconnu";

  const nluResult = await manager.process("fr", message);
  const intent = nluResult.intent;
  const confidence = nluResult.score;

  // 🔹 Détection du lieu avec synonymes + fuzzy matching
  let targetTitle = null;
  const targetEntity = nluResult.entities.find(e => e.entity === "lieu");

  if (targetEntity && targetEntity.option) {
    targetTitle = SYNONYMS[targetEntity.option.toLowerCase()] || targetEntity.option;
  } else {
    const normalizedMessage = normalize(message);
    const synKey = Object.keys(SYNONYMS).find(k => normalizedMessage.includes(normalize(k)));
    if (synKey) targetTitle = SYNONYMS[synKey];
    else {
      const allTitles = Object.values(SCENES).map(s => normalize(s.title));
      const results = fuzz.extract(normalizedMessage, allTitles, { scorer: fuzz.ratio, returnObjects: true });
      if (results.length > 0 && results[0].score > 60) {
        targetTitle = Object.values(SCENES).find(s => normalize(s.title) === results[0].choice)?.title;
      }
    }
  }

  const targetSceneId = targetTitle
    ? Object.keys(SCENES).find(id => SCENES[id].title === targetTitle)
    : null;

  // --- Navigation ---
  if (intent === "navigation.goto") {
    if (!targetSceneId) return { reply: `Lieu inconnu : ${targetTitle || "demandé"}` };

    if (targetSceneId === currentSceneId)
      return { reply: `✨ Vous êtes déjà dans : **${SCENES[targetSceneId].title}**` };

    return {
      reply: null, // on n’envoie pas le message, frontend gérera
      command: { type: "loadScene", sceneId: targetSceneId }
    };
  }

  // --- Informations ---
  if (intent.startsWith("info.")) {
    const infoSceneId = ["info.describe_current", "info.whereami"].includes(intent)
      ? currentSceneId
      : targetSceneId;

    const annotation = await Annotation.findOne({ scene_id: infoSceneId });
    return { reply: annotation?.annotation || "Aucune annotation trouvée." };
  }

  // --- Fallback LLM ---
  if (confidence < 0.5 || intent === "None") {
    const llmReply = await queryLLM(message, currentSceneTitle);
    return { reply: llmReply };
  }

  return { reply: "Je peux vous aider à naviguer ou décrire des lieux !" };
}

// --- Route chatbot ---
router.post("/", async (req, res) => {
  const { message, currentSceneId } = req.body;
  if (!message || !currentSceneId)
    return res.status(400).json({ reply: "Message et currentSceneId requis." });

  try {
    const response = await processChatRequest(message, currentSceneId);
    res.json(response);
  } catch (err) {
    console.error("Erreur Chatbot :", err);
    res.status(500).json({ reply: "Erreur interne du serveur." });
  }
});

// --- Initialisation NLU ---
initNLU();

export default router;
