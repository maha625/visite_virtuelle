import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import scenesRouter from "./routes/scenes.js";
import chatRouter from "./routes/chat.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Sert le dossier des images
app.use("/image", express.static(path.join(__dirname, "image")));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use("/scenes", scenesRouter);
app.use("/chat", chatRouter);
app.use("/auth", authRouter);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express prêt sur http://localhost:${PORT}`);
});
