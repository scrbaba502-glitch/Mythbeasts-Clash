import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifestUrl = new URL("../public/assets/environments/manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

test("Ruined Sanctuary manifest declares a rectangular metric battlefield", () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.environmentId, "ruined-sanctuary");
  assert.equal(manifest.coordinateContract.units, "meters");
  assert.equal(manifest.coordinateContract.upAxis, "+Y");
  assert.equal(manifest.gameplayBounds.shape, "rectangular");
  assert.ok(manifest.gameplayBounds.width > 0);
  assert.ok(manifest.gameplayBounds.depth > 0);
});

test("environment asset IDs and delivery paths are unique", () => {
  const ids = manifest.assets.map(asset => asset.id);
  const paths = manifest.assets.map(asset => asset.path);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(paths).size, paths.length);
  for (const asset of manifest.assets) {
    assert.match(asset.path, /^\/assets\/environments\/ruined-sanctuary\/.+\.glb$/);
    assert.ok(["walkable", "proxy", "none"].includes(asset.collision));
    assert.ok(["modular-ground", "hero-landmark", "modular-architecture", "hero-prop", "modular-prop", "background"].includes(asset.category));
    assert.ok(Array.isArray(asset.lod) && asset.lod.length > 0);
  }
});

test("required P0 environment landmarks are represented in the manifest", () => {
  for (const id of ["combat-floor", "flagstone-kit", "broken-arch-hero", "colonnade-kit", "guardian-effigies"]) {
    const asset = manifest.assets.find(item => item.id === id);
    assert.ok(asset, `Missing required environment asset: ${id}`);
    assert.equal(asset.required, true);
  }
});

test("environment manifest does not misrepresent pending art as delivered", () => {
  assert.equal(manifest.assetStatus, "procedural-blockout");
  assert.ok(manifest.assets.every(asset => asset.status === "production-asset-pending"));
});
