// backend/models/Annotation.js
import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema({
  scene_id: { type: String, required: true },
  annotation: { type: String, default: "" },
});

export const Annotation = mongoose.model("Annotation", annotationSchema, "annotation_d_image");
