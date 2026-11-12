import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { inspectCharacterGlb } from "../src/game/glb-inspection.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async relative => JSON.parse(await readFile(path.join(root, relative), "utf8"));
const verifyGlb = async (assetPath, label, requiredClips = []) => {
  const diskPath = path.join(root, "public", assetPath.replace(/^\/+/, ""));
  const info = await stat(diskPath);
  assert.ok(info.size >= 20, `${label}: GLB is unexpectedly small`);
  const bytes = await readFile(diskPath);
  const inspection = inspectCharacterGlb(bytes, requiredClips);
  assert.equal(inspection.valid, true, `${label}: ${inspection.problems.join("; ")}`);
};

test("a character cannot be marked production-ready without a valid rigged GLB", async () => {
  const manifest = await readJson("public/assets/characters/manifest.json");
  for (const [id, entry] of Object.entries(manifest.characters)) {
    assert.ok(["production-asset-pending", "production-asset-ready"].includes(entry.assetStatus),
      `${id}: unknown asset status`);
    if (entry.assetStatus === "production-asset-ready") {
      await verifyGlb(entry.model, id, entry.requiredClips || []);
    }
  }
});

test("an environment asset cannot be marked production-ready without a valid GLB", async () => {
  const manifest = await readJson("public/assets/environments/manifest.json");
  for (const entry of manifest.assets) {
    assert.ok(["production-asset-pending", "production-asset-ready"].includes(entry.status),
      `${entry.id}: unknown asset status`);
    if (entry.status === "production-asset-ready") {
      const diskPath = path.join(root, "public", entry.path.replace(/^\/+/, ""));
      const info = await stat(diskPath);
      assert.ok(info.size >= 20, `${entry.id}: GLB is unexpectedly small`);
      const bytes = await readFile(diskPath);
      assert.equal(bytes.toString("ascii", 0, 4), "glTF", `${entry.id}: invalid GLB magic`);
      assert.equal(bytes.readUInt32LE(4), 2, `${entry.id}: GLB must use glTF 2.0`);
      assert.equal(bytes.readUInt32LE(8), info.size, `${entry.id}: GLB declared length mismatch`);
    }
  }
});

test("current roster and sanctuary are honestly classified as pre-production", async () => {
  const characters = await readJson("public/assets/characters/manifest.json");
  const environment = await readJson("public/assets/environments/manifest.json");
  for (const entry of Object.values(characters.characters)) {
    assert.equal(entry.assetStatus, "production-asset-pending");
  }
  assert.equal(environment.assetStatus, "procedural-blockout");
  assert.ok(environment.assets.every(asset => asset.status === "production-asset-pending"),
    "Do not silently promote placeholder environment assets to production art");
});
