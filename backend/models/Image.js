// backend/models/Image.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  id_image: { type: String, required: true },
  title: String,
  type: { type: String, default: "equirectangular" },
  chemin_image: String,
  hfov: { type: Number, default: 100 },
  pitch: { type: Number, default: 0 },
  yaw: { type: Number, default: 0 },
  hotSpots: { type: Array, default: [] },
  annotation: { type: String, default: "" },
}, { collection: "image" });

export const Image = mongoose.model("Image", imageSchema);
