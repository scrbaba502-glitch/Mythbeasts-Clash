import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AnimationStateController } from "./animation.js";

const loader = new GLTFLoader();

export async function loadRiggedCharacter(fighter, url, { scale = 1, rotationY = 0, fadeSeconds = .12 } = {}) {
  const gltf = await loader.loadAsync(url);
  if (!gltf.scene) throw new Error(`Character asset has no scene: ${url}`);

  const model = gltf.scene;
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
