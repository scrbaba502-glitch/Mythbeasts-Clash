import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const READY_STATUS = "production-asset-ready";

export async function loadEnvironmentAssets(scene, manifest, {
  gltfLoader = loader,
  onAssetError = () => {}
} = {}) {
  const result = { loaded: [], pending: [], failed: [] };

  for (const asset of manifest.assets) {
    if (asset.status !== READY_STATUS) {
      result.pending.push(asset.id);
      continue;
    }

    try {
      const gltf = await gltfLoader.loadAsync(asset.path);
      if (!gltf.scene) throw new Error("GLB contains no scene root");
      gltf.scene.name = asset.id;
      gltf.scene.traverse(node => {
        if (!node.isMesh) return;
        node.castShadow = asset.collision !== "none";
        node.receiveShadow = true;
      });
      scene.add(gltf.scene);
      result.loaded.push(asset.id);
    } catch (error) {
      result.failed.push({ id: asset.id, path: asset.path, message: error?.message || String(error) });
      onAssetError(asset, error);
    }
  }

  return result;
}

export { READY_STATUS };
