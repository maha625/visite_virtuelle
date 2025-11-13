import mongoose from 'mongoose';

// ⚡ Schema correspondant à votre collection existante
const annotationSchema = new mongoose.Schema({
  scene_id: { type: String, required: true },  // correspond à MongoDB
  annotation: { type: String, required: true },
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'annotation_d_image' }); // ⚠️ Collection exacte

export const Annotation = mongoose.model('Annotation', annotationSchema);
