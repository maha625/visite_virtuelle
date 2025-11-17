import { NlpManager } from 'node-nlp';
import { Annotation } from './Annotation.js';
import mongoose from 'mongoose';
import { loadScenesFromDB } from './loadScenes.js';
import axios from 'axios';

let scenes = {}; // scènes chargées depuis MongoDB
await loadScenesFromDB().then(data => scenes = data);

const manager = new NlpManager({ languages: ['fr'] });

// Fonction utilitaire
function getSceneTitle(sceneId) {
  return scenes[sceneId]?.title || "Lieu inconnu";
}

// Traitement du message
export async function processChatRequest(message, currentSceneId) {
  const nluResult = await manager.process('fr', message);
  const intent = nluResult.intent;
  const confidence = nluResult.score;

  const currentSceneTitle = getSceneTitle(currentSceneId);

  // Si NLU faible -> LLM
  if (confidence < 0.5 || intent === 'None') {
    // Appel LLM
  }

  if (intent === 'navigation.goto') {
    const targetEntity = nluResult.entities.find(e => e.entity === 'lieu');
    const targetSceneId = targetEntity ? targetEntity.option : null;
    const targetTitle = targetSceneId ? getSceneTitle(targetSceneId) : null;

    if (!targetTitle) return { reply: `Lieu inconnu : ${targetEntity?.option || 'demandé'}` };

    // ✨ Message avec le titre depuis MongoDB
    return {
      reply: `✨ Vous êtes maintenant dans : ${targetTitle}`,
      command: { type: 'loadScene', sceneId: targetSceneId }
    };
  }

  if (intent.startsWith('info.')) {
    const annotation = await Annotation.findOne({ scene_id: currentSceneId });
    let reply = annotation?.annotation || "Aucune annotation trouvée pour ce lieu.";
    return { reply };
  }

  return { reply: "Je peux vous aider à naviguer ou décrire des lieux !" };
}
