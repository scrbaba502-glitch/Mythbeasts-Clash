import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadEnvironmentAssets, READY_STATUS } from "../src/game/environment-assets.js";

const manifest = JSON.parse(await readFile(new URL("../public/assets/environments/manifest.json", import.meta.url), "utf8"));

test("pending environment assets are skipped without network requests", async () => {
  let calls = 0;
  const result = await loadEnvironmentAssets({ add() {} }, manifest, {
    gltfLoader: { async loadAsync() { calls++; throw new Error("must not load pending assets"); } }
  });
  assert.equal(calls, 0);
  assert.equal(result.pending.length, manifest.assets.length);
  assert.equal(result.loaded.length, 0);
  assert.equal(result.failed.length, 0);
});

test("ready environment assets are attached to the scene", async () => {
  const scene = { children: [], add(node) { this.children.push(node); } };
  const readyManifest = {
    assets: [{ id: "arch", path: "/arch.glb", status: READY_STATUS, collision: "proxy" }]
  };
  const model = {
    name: "",
    traverse(callback) { callback({ isMesh: true, castShadow: false, receiveShadow: false }); }
  };
  const result = await loadEnvironmentAssets(scene, readyManifest, {
    gltfLoader: { async loadAsync() { return { scene: model }; } }
  });
  assert.deepEqual(result.loaded, ["arch"]);
  assert.equal(scene.children[0], model);
  assert.equal(model.name, "arch");
});

test("failed optional asset loads are reported while other assets can continue", async () => {
  const failures = [];
  const failedManifest = {
    assets: [
      { id: "bad", path: "/bad.glb", status: READY_STATUS, collision: "none" },
      { id: "pending", path: "/pending.glb", status: "production-asset-pending", collision: "none" }
    ]
  };
  const result = await loadEnvironmentAssets({ add() {} }, failedManifest, {
    gltfLoader: { async loadAsync() { throw new Error("missing file"); } },
    onAssetError: asset => failures.push(asset.id)
  });
  assert.deepEqual(result.failed.map(item => item.id), ["bad"]);
  assert.deepEqual(result.pending, ["pending"]);
  assert.deepEqual(failures, ["bad"]);
});
