// backend/nluManager.js
import { NlpManager } from "node-nlp";
import { loadScenesFromDB } from "./models/loadScenes.js";

// NlpManager central
const manager = new NlpManager({ languages: ["fr"], forceNER: true });
let SCENES = {};

// Normalisation pour fuzzy matching
const normalize = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Initialisation NLU et chargement des scènes
async function initNLU() {
  if (Object.keys(SCENES).length > 0) return; // évite double init

  SCENES = await loadScenesFromDB();
  const SCENE_TITLES = Object.values(SCENES).map(s => s.title);

  // ----- Entités -----
  SCENE_TITLES.forEach(title =>
    manager.addNamedEntityText("lieu", title, ["fr"], [title.toLowerCase()])
  );

  // ----- Navigation -----
  [
    "je veux aller à %lieu%",
    "emmène-moi à %lieu%",
    "vas à %lieu%",
    "où est %lieu%",
    "montre moi %lieu%"
  ].forEach(doc => manager.addDocument("fr", doc, "navigation.goto"));

  // ----- Infos -----
  [
    "décris-moi %lieu%",
    "parle-moi de %lieu%",
    "quelles sont les infos sur %lieu%"
  ].forEach(doc => manager.addDocument("fr", doc, "info.describe"));
  ["détails de la scène", "décris ici"].forEach(doc =>
    manager.addDocument("fr", doc, "info.describe_current")
  );
  ["où suis-je", "quelle est cette pièce"].forEach(doc =>
    manager.addDocument("fr", doc, "info.whereami")
  );

  console.log("⏳ Entraînement NLU...");
  await manager.train();
  console.log("✅ NLU prêt avec toutes les scènes !");
}

export { manager, SCENES, initNLU, normalize };
