import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const READY_STATUS = "production-asset-ready";

/**
 * Load all approved environment GLBs concurrently. Pending assets never trigger
 * network requests, and an individual failed asset never blocks the rest.
 */
export async function loadEnvironmentAssets(scene, manifest, {
  gltfLoader = loader,
  onAssetError = () => {},
  onAssetLoaded = () => {}
} = {}) {
  const result = { loaded: [], pending: [], failed: [] };
  const readyAssets = [];

  for (const asset of manifest.assets) {
    if (asset.status !== READY_STATUS) {
      result.pending.push(asset.id);
    } else {
      readyAssets.push(asset);
    }
  }

  const outcomes = await Promise.all(readyAssets.map(async asset => {
    try {
      const gltf = await gltfLoader.loadAsync(asset.path);
      if (!gltf?.scene) throw new Error("GLB contains no scene root");

      gltf.scene.name = asset.id;
      gltf.scene.traverse(node => {
        if (!node.isMesh) return;
        // Render visibility and gameplay collision are separate concerns:
        // decorative meshes must still cast shadows when collision is disabled.
        node.castShadow = true;
        node.receiveShadow = true;
      });
      scene.add(gltf.scene);
      onAssetLoaded(asset, gltf.scene);
      return { status: "loaded", id: asset.id };
    } catch (error) {
      const failure = {
        id: asset.id,
        path: asset.path,
        message: error?.message || String(error)
      };
      try {
        onAssetError(asset, error);
      } catch {
        // Diagnostic callbacks must not turn an optional asset failure fatal.
      }
      return { status: "failed", failure };
    }
  }));

  for (const outcome of outcomes) {
    if (outcome.status === "loaded") result.loaded.push(outcome.id);
    else result.failed.push(outcome.failure);
  }

  return result;
}

export { READY_STATUS };
