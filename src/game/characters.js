import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AnimationStateController } from "./animation.js";

const loader = new GLTFLoader();
const normalizeClipName = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function getMissingRequiredClips(requiredClips = [], animations = []) {
  const available = new Set(animations.map(clip => normalizeClipName(clip.name)));
  return requiredClips.filter(name => !available.has(normalizeClipName(name)));
}

export async function loadRiggedCharacter(fighter, url, {
  scale = 1,
  rotationY = 0,
  fadeSeconds = .12,
  requiredClips = []
} = {}) {
  const gltf = await loader.loadAsync(url);
  if (!gltf.scene) throw new Error(`Character asset has no scene: ${url}`);

  const missingClips = getMissingRequiredClips(requiredClips, gltf.animations || []);
  if (missingClips.length) {
    gltf.scene.traverse(node => {
      if (!node.isMesh) return;
      node.geometry?.dispose();
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) material?.dispose();
    });
    throw new Error(`Character asset ${url} is missing required animation clips: ${missingClips.join(", ")}`);
  }

  const model = gltf.scene;
  if (fighter.disposed) {
    model.traverse(node => {
      if (!node.isMesh) return;
      node.geometry?.dispose();
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) material?.dispose();
    });
    throw new Error(`Character load completed after arena disposal: ${url}`);
  }
  model.scale.setScalar(scale);
  model.rotation.y = rotationY;
  model.position.set(0, 0, 0);
  const assetMaterials = new Set();
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    if (node.material) {
      for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
        material.roughness = Math.max(.28, material.roughness ?? .7);
        if (material.emissive) assetMaterials.add(material);
      }
    }
  });

  fighter.animator?.destroy();
  fighter.root.traverse(node => {
    if (!node.isMesh) return;
    node.geometry?.dispose();
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) material?.dispose();
  });
  fighter.root.clear();
  fighter.root.add(model);
  fighter.animator = new AnimationStateController(model, gltf.animations, { fadeSeconds });
  fighter.assetMaterials = [...assetMaterials].map(material => ({
    material,
    baseEmissive: material.emissive.clone(),
    baseIntensity: material.emissiveIntensity ?? 1
  }));
  fighter.assetLoaded = true;
  return { model, animator: fighter.animator, animations: gltf.animations.map(clip => clip.name) };
}
