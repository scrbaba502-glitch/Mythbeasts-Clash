import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateEnvironmentManifest } from "../src/game/environment.js";

const manifestUrl = new URL("../public/assets/environments/manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

test("environment manifest validates and returns metric rectangular bounds", () => {
  const environment = validateEnvironmentManifest(manifest);
  assert.equal(environment.id, "ruined-sanctuary");
  assert.equal(environment.width, 20.8);
  assert.equal(environment.depth, 16.6);
  assert.equal(environment.halfWidth, 10.4);
  assert.equal(environment.halfDepth, 8.3);
  assert.equal(environment.assetStatus, "procedural-blockout");
});

test("environment validator rejects unsupported coordinate systems", () => {
  const invalid = structuredClone(manifest);
  invalid.coordinateContract.upAxis = "+Z";
  assert.throws(() => validateEnvironmentManifest(invalid), /coordinate contract/i);
});

test("environment validator rejects duplicate asset paths", () => {
  const invalid = structuredClone(manifest);
  invalid.assets[1].path = invalid.assets[0].path;
  assert.throws(() => validateEnvironmentManifest(invalid), /unique/i);
});

test("environment validator rejects missing required landmarks", () => {
  const invalid = structuredClone(manifest);
  invalid.assets = invalid.assets.filter(asset => asset.id !== "broken-arch-hero");
  assert.throws(() => validateEnvironmentManifest(invalid), /broken-arch-hero/i);
});

test("environment validator rejects malformed gameplay bounds", () => {
  const invalid = structuredClone(manifest);
  invalid.gameplayBounds.width = 0;
  assert.throws(() => validateEnvironmentManifest(invalid), /positive rectangle/i);
});

test("manifest loader reports an unavailable resource clearly", async () => {
  const { loadEnvironmentManifest } = await import("../src/game/environment.js");
  await assert.rejects(
    loadEnvironmentManifest("/missing.json", async () => ({ ok: false, status: 404 })),
    /unavailable \(404\)/i
  );
});
