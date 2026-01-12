import express from "express";
import axios from "axios";
import * as fuzz from "fuzzball";
import { manager, SCENES, initNLU, normalize } from "../nluManager.js";
import Image from "../models/Image.js";
import { SYNONYMS } from "../models/synonyms.js";

const router = express.Router();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const LLM_MODEL = "openai/gpt-oss-20b:groq";
const HUGGING_FACE_API_URL = "https://router.huggingface.co/v1/chat/completions";

/* ============================================================
🔹 1) Fonction : Appeler Hugging Face en utilisant l’annotation
=============================================================== */
async function queryLLM(userMessage, currentSceneTitle, annotation) {
  if (!HUGGING_FACE_API_KEY) return "Erreur : Clé Hugging Face manquante.";

  const systemPrompt = `
Tu es un guide virtuel dans une visite virtuelle interactive dans l'ENSAM Meknes Maroc.
Tu dois aider l’utilisateur en utilisant les données suivantes :

=== DONNÉES DE LA SCÈNE "${currentSceneTitle}" ===
${annotation?.information ? `Information : ${annotation.information}` : ""}
${annotation?.objects?.length ? "Objets :\n" + annotation.objects.map(o => `- ${o.label} : ${o.description}`).join("\n") : ""}
${annotation?.related_scenes ? "Directions :\n" + Object.entries(annotation.related_scenes).map(([dir, title]) => `- ${dir} → ${title}`).join("\n") : ""}
===================================================

RÈGLES IMPORTANTES :
1. Utilise **en priorité** les données ci-dessus.
2. Si ces données ne suffisent pas, complète avec tes connaissances.
3. Répond toujours avec la même langue que la question et de façon courte.
`;

  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      {
        model: LLM_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
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

/* ============================================================
🔹 2) Fonction principale de traitement du message
=============================================================== */
async function processChatRequest(message, currentSceneId) {
  const currentSceneTitle = SCENES[currentSceneId]?.title || "Lieu inconnu";

  // 1️⃣ Analyse NLU
  const nluResult = await manager.process("fr", message);
  const intent = nluResult.intent;
  const confidence = nluResult.score;

  // 2️⃣ Questions générales (définitions / "c'est quoi ...")
  const generalQuestionKeywords = ["quoi", "définir", "c'est quoi", "définition"];
  if (generalQuestionKeywords.some(k => message.toLowerCase().includes(k))) {
    const llmReply = await queryLLM(message, currentSceneTitle, {});
    return { reply: llmReply };
  }

  // 3️⃣ Détection du lieu pour navigation ou info spécifique
  let targetTitle = null;
  const targetEntity = nluResult.entities.find(e => e.entity === "lieu");

  if (targetEntity?.option) {
    targetTitle = SYNONYMS[targetEntity.option.toLowerCase()] || targetEntity.option;
  } else {
    const normalizedMessage = normalize(message);
    const synKey = Object.keys(SYNONYMS).find(k =>
      normalizedMessage.includes(normalize(k))
    );
    if (synKey) targetTitle = SYNONYMS[synKey];
    else {
      const allTitles = Object.values(SCENES).map(s => normalize(s.title));
      const result = fuzz.extract(normalizedMessage, allTitles, { scorer: fuzz.ratio, returnObjects: true });
      if (result.length > 0 && result[0].score > 60) {
        targetTitle = Object.values(SCENES).find(s => normalize(s.title) === result[0].choice)?.title;
      }
    }
  }

  const targetSceneId = targetTitle
    ? Object.keys(SCENES).find(id => SCENES[id].title === targetTitle)
    : null;

  // 4️⃣ Navigation
  if (intent === "navigation.goto") {
    if (!targetSceneId) return { reply: `Lieu inconnu : ${targetTitle || "demandé"}` };
    if (targetSceneId === currentSceneId) return { reply: `✨ Vous êtes déjà dans : **${SCENES[targetSceneId].title}**` };
    return { reply: null, command: { type: "loadScene", sceneId: targetSceneId } };
  }

  // 5️⃣ Info sur scène
  if (intent.startsWith("info.")) {
    const infoSceneId = ["info.describe_current", "info.whereami"].includes(intent) ? currentSceneId : targetSceneId;
    const scene = await Image.findOne({ id_image: infoSceneId });
    if (!scene?.annotation) {
      const llmReply = await queryLLM(message, currentSceneTitle, {});
      return { reply: llmReply };
    }

    // Préparer texte pour reformulation
    const annotationText = [];
    if (scene.annotation.information) annotationText.push(scene.annotation.information);
    if (scene.annotation.objects?.length) {
      annotationText.push("Objets importants :");
      scene.annotation.objects.forEach(o => annotationText.push(`- ${o.label} : ${o.description}`));
    }
    if (scene.annotation.related_scenes) {
      annotationText.push("Directions disponibles :");
      Object.entries(scene.annotation.related_scenes).forEach(([dir, title]) =>
        annotationText.push(`- ${dir} → ${title}`)
      );
    }

    const llmReply = await queryLLM(message, currentSceneTitle, { information: annotationText.join("\n") });
    return { reply: llmReply };
  }

  // 6️⃣ Fallback général si NLU faible ou inconnu
  if (confidence < 0.5 || intent === "None") {
    const scene = await Image.findOne({ id_image: currentSceneId });
    const llmReply = await queryLLM(message, currentSceneTitle, scene?.annotation || {});
    return { reply: llmReply };
  }

  return { reply: "Je peux vous aider à naviguer ou décrire des lieux !" };
}

/* ============================================================
🔹 3) Route POST /chat
=============================================================== */
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

initNLU();
export default router;
