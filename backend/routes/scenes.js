// backend/routes/scenes.js
import express from "express";
import { loadScenesFromDB } from "../models/loadScenes.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const scenes = await loadScenesFromDB();
  res.json(scenes);
});

export default router;
