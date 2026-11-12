const REQUIRED_ASSETS = new Set([
  "combat-floor",
  "flagstone-kit",
  "broken-arch-hero",
  "colonnade-kit",
  "guardian-effigies"
]);

export function validateEnvironmentManifest(manifest) {
  if (!manifest || manifest.schemaVersion !== 1) {
    throw new Error("Unsupported environment manifest schema");
  }
  if (manifest.environmentId !== "ruined-sanctuary") {
    throw new Error("Unknown environment manifest identity");
  }
  const coordinates = manifest.coordinateContract;
  if (coordinates?.units !== "meters" || coordinates?.upAxis !== "+Y" || coordinates?.forwardAxis !== "+Z") {
    throw new Error("Environment coordinate contract must use meters, +Y up and +Z forward");
  }

  const bounds = manifest.gameplayBounds;
  if (bounds?.shape !== "rectangular" ||
      !Number.isFinite(bounds.width) || bounds.width <= 0 ||
      !Number.isFinite(bounds.depth) || bounds.depth <= 0) {
    throw new Error("Environment gameplay bounds must be a positive rectangle");
  }

  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new Error("Environment manifest must declare assets");
  }
  const ids = new Set();
  const paths = new Set();
  for (const asset of manifest.assets) {
    if (!asset || typeof asset.id !== "string" || !asset.id ||
        typeof asset.path !== "string" ||
        !/^\/assets\/environments\/ruined-sanctuary\/[a-z0-9-]+\.glb$/i.test(asset.path)) {
      throw new Error("Environment asset entry has an invalid identity or GLB path");
    }
    if (ids.has(asset.id) || paths.has(asset.path)) {
      throw new Error("Environment asset IDs and paths must be unique");
    }
    ids.add(asset.id);
    paths.add(asset.path);
    if (!["walkable", "proxy", "none"].includes(asset.collision)) {
      throw new Error(`Invalid collision mode for environment asset: ${asset.id}`);
    }
    if (!Array.isArray(asset.lod) || asset.lod.length === 0) {
      throw new Error(`Environment asset is missing LOD declarations: ${asset.id}`);
    }
  }

  for (const id of REQUIRED_ASSETS) {
    const asset = manifest.assets.find(candidate => candidate.id === id);
    if (!asset || asset.required !== true) {
      throw new Error(`Required environment asset is not declared: ${id}`);
    }
  }

  return Object.freeze({
    id: manifest.environmentId,
    width: bounds.width,
    depth: bounds.depth,
    halfWidth: bounds.width / 2,
    halfDepth: bounds.depth / 2,
    assetStatus: manifest.assetStatus
  });
}

export async function loadEnvironmentManifest(url = "/assets/environments/manifest.json", fetchImpl = fetch) {
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`Environment manifest unavailable (${response.status})`);
  return validateEnvironmentManifest(await response.json());
}
