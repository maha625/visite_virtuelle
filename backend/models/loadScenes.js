//backend\models\loadScenes.js
import Image from "./Image.js";

export async function loadScenesFromDB() {
  try {
    const allScenes = await Image.find({}).lean();
    console.log("🔹 Documents trouvés :", allScenes.length);
    return allScenes.reduce((acc, sc) => {
      acc[sc.id_image] = {
        title: sc.title,
        type: sc.type,
        panorama: sc.chemin_image,
        hfov: sc.hfov,
        pitch: sc.pitch,
        yaw: sc.yaw,
        hotSpots: sc.hotSpots,
        annotation: sc.annotation,
      };
      return acc;
    }, {});
  } catch (err) {
    console.error("❌ Error loading scenes:", err);
    return {};
  }
}
