//backend\models\Image.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: String,
  chemin_image: String,
  id_image: String,
  type: String,
  annotation: {
    related_scenes: Object,
    objects: Array,
    information: String,
  },
  hfov: Number,
  pitch: Number,
  yaw: Number,
  hotSpots: Array
});

// ⚠️ nom exact de la collection
const Image = mongoose.model("Image", imageSchema, "image");

export default Image;
