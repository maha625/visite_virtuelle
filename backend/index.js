// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import scenesRouter from "./routes/scenes.js";
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/projet_d'initiation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use("/scenes", scenesRouter);
app.use("/chat", chatRouter);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express prêt sur http://localhost:${PORT}`);
});
