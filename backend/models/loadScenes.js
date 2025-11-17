import { Image } from "./Image.js";

export async function loadScenesFromDB() {
  try {
    const allScenes = await Image.find({}).lean(); // ça va chercher la collection "image"
    const scenes = {};

    allScenes.forEach(sc => {
      scenes[sc.id_image] = {
        title: sc.title,
        type: sc.type,
        panorama: sc.chemin_image,
        hfov: sc.hfov,
        pitch: sc.pitch,
        yaw: sc.yaw,
        hotSpots: sc.hotSpots,
        annotation: sc.annotation,
      };
    });

    console.log("📌 Scenes loaded from MongoDB:", Object.keys(scenes).length);
    return scenes;
  } catch (err) {
    console.error("❌ Error loading scenes:", err);
    return {};
  }
}
