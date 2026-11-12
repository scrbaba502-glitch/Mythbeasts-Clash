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

test("ready assets load concurrently and attach with render shadows", async () => {
  const scene = { children: [], add(node) { this.children.push(node); } };
  const readyManifest = {
    assets: [
      { id: "arch", path: "/arch.glb", status: READY_STATUS, collision: "none" },
      { id: "statue", path: "/statue.glb", status: READY_STATUS, collision: "proxy" }
    ]
  };
  const started = [];
  const makeModel = () => ({
    name: "",
    mesh: { isMesh: true, castShadow: false, receiveShadow: false },
    traverse(callback) { callback(this.mesh); }
  });
  const models = new Map();
  const result = await loadEnvironmentAssets(scene, readyManifest, {
    gltfLoader: {
      async loadAsync(path) {
        started.push(path);
        const model = makeModel();
        models.set(path, model);
        return { scene: model };
      }
    }
  });
  assert.deepEqual(started, ["/arch.glb", "/statue.glb"]);
  assert.deepEqual(result.loaded, ["arch", "statue"]);
  assert.equal(scene.children.length, 2);
  assert.equal(models.get("/arch.glb").name, "arch");
  assert.equal(models.get("/arch.glb").mesh.castShadow, true);
  assert.equal(models.get("/arch.glb").mesh.receiveShadow, true);
});

test("failed optional asset loads are reported while other assets continue", async () => {
  const failures = [];
  const failedManifest = {
    assets: [
      { id: "bad", path: "/bad.glb", status: READY_STATUS, collision: "none" },
      { id: "good", path: "/good.glb", status: READY_STATUS, collision: "none" },
      { id: "pending", path: "/pending.glb", status: "production-asset-pending", collision: "none" }
    ]
  };
  const result = await loadEnvironmentAssets({ add() {} }, failedManifest, {
    gltfLoader: {
      async loadAsync(path) {
        if (path === "/bad.glb") throw new Error("missing file");
        return { scene: { name: "", traverse() {} } };
      }
    },
    onAssetError: asset => {
      failures.push(asset.id);
      throw new Error("diagnostics must not break loading");
    }
  });
  assert.deepEqual(result.failed.map(item => item.id), ["bad"]);
  assert.deepEqual(result.loaded, ["good"]);
  assert.deepEqual(result.pending, ["pending"]);
  assert.deepEqual(failures, ["bad"]);
});
