import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware pour vérifier le JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token invalide" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
};

// SIGNUP
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ message: "Tous les champs sont requis." });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email déjà utilisé." });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullName, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email ou mot de passe incorrect." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Email ou mot de passe incorrect." });

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
  res.status(200).json({
    message: "Connexion réussie",
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email }
  });
});

// UPDATE PASSWORD
router.put("/update-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: "Tous les champs sont requis." });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect." });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
});

// DELETE ACCOUNT
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur.", error: err });
  }
});

export default router;
