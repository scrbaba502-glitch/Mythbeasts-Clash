import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifestUrl = new URL("../public/assets/characters/manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

test("character manifest declares the production coordinate contract", () => {
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.units, "meters");
  assert.equal(manifest.forwardAxis, "+Z");
  assert.equal(manifest.upAxis, "+Y");
  assert.equal(manifest.rootAtGround, true);
});

test("Vyrak production manifest includes the complete three-hit combo", () => {
  const vyrak = manifest.characters.vyrak;
  assert.ok(vyrak, "Vyrak entry must exist");
  for (const clip of ["Idle", "Locomotion", "Attack", "Attack2", "Attack3", "Dodge", "Hit", "Skill", "Victory", "Defeat"]) {
    assert.ok(vyrak.requiredClips.includes(clip), `Vyrak is missing required clip: ${clip}`);
  }
  assert.match(vyrak.model, /^\/assets\/characters\/vyrak\/.+\.glb$/);
  assert.equal(vyrak.assetStatus, "production-asset-pending");
});

test("Atrox production manifest includes boss telegraph and reaction clips", () => {
  const atrox = manifest.characters.atrox;
  assert.ok(atrox, "Atrox entry must exist");
  for (const clip of ["Idle", "Locomotion", "BossWindup", "Attack", "Hit", "Stagger", "Victory", "Defeat"]) {
    assert.ok(atrox.requiredClips.includes(clip), `Atrox is missing required clip: ${clip}`);
  }
  assert.match(atrox.model, /^\/assets\/characters\/atrox\/.+\.glb$/);
});

test("roster asset paths and clip names are unique and valid", () => {
  const entries = Object.entries(manifest.characters);
  assert.ok(entries.length >= 2);
  const modelPaths = entries.map(([, entry]) => entry.model);
  assert.equal(new Set(modelPaths).size, modelPaths.length);
  for (const [id, entry] of entries) {
    assert.match(id, /^[a-z][a-z0-9-]*$/);
    assert.ok(entry.displayName && entry.role && entry.visualIdentity.length > 0);
    assert.equal(new Set(entry.requiredClips).size, entry.requiredClips.length);
    assert.equal(new Set(entry.optionalClips).size, entry.optionalClips.length);
  }
});
