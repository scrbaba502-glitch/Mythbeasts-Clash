import test from "node:test";
import assert from "node:assert/strict";
import { readGlbDocument, inspectCharacterGlb } from "../src/game/glb-inspection.js";

const JSON_CHUNK = 0x4e4f534a;
function makeGlb(document, { version = 2, declaredLength, chunkType = JSON_CHUNK } = {}) {
  const json = Buffer.from(JSON.stringify(document).padEnd(Math.ceil(JSON.stringify(document).length / 4) * 4, " "));
  const total = 12 + 8 + json.length;
  const bytes = Buffer.alloc(total);
  bytes.writeUInt32LE(0x46546c67, 0);
  bytes.writeUInt32LE(version, 4);
  bytes.writeUInt32LE(declaredLength ?? total, 8);
  bytes.writeUInt32LE(json.length, 12);
  bytes.writeUInt32LE(chunkType, 16);
  json.copy(bytes, 20);
  return bytes;
}
const validChampion = {
  asset: { version: "2.0" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0, skin: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }],
  skins: [{ joints: [1] }],
  materials: [{ pbrMetallicRoughness: {} }],
  animations: ["Idle", "Run", "Attack", "Attack2", "Attack3", "Dodge", "Hit", "Skill", "Victory", "Defeat"]
    .map(name => ({ name, channels: [{ sampler: 0, target: { node: 0, path: "translation" } }], samplers: [{ input: 0, output: 1, interpolation: "LINEAR" }] }))
};

test("GLB reader parses a valid glTF 2.0 JSON chunk", () => {
  const parsed = readGlbDocument(makeGlb(validChampion));
  assert.equal(parsed.asset.version, "2.0");
  assert.equal(parsed.animations.length, 10);
});

test("GLB reader rejects invalid magic, version, declared length and chunk order", () => {
  assert.throws(() => readGlbDocument(Buffer.alloc(16)), /shorter/);
  assert.throws(() => readGlbDocument(makeGlb(validChampion, { version: 1 })), /version/);
  assert.throws(() => readGlbDocument(makeGlb(validChampion, { declaredLength: 99 })), /total length/);
  assert.throws(() => readGlbDocument(makeGlb(validChampion, { chunkType: 0x004e4942 })), /first chunk/);
});

test("character inspection requires a skinned mesh, materials and complete combat clips", () => {
  const result = inspectCharacterGlb(makeGlb(validChampion), ["Idle", "Locomotion", "Attack", "Attack2", "Attack3", "Dodge", "Hit", "Skill", "Victory", "Defeat"]);
  assert.equal(result.valid, true, result.problems.join("; "));
});

test("character inspection reports missing rig, mesh, material and required clips", () => {
  const broken = { ...validChampion, meshes: [], skins: [], materials: [], animations: [{ name: "Idle", channels: [], samplers: [] }] };
  const result = inspectCharacterGlb(makeGlb(broken), ["Idle", "Attack", "Dodge"]);
  assert.equal(result.valid, false);
  assert.ok(result.problems.some(problem => problem.includes("no meshes")));
  assert.ok(result.problems.some(problem => problem.includes("no skin")));
  assert.ok(result.problems.some(problem => problem.includes("no materials")));
  assert.ok(result.problems.some(problem => problem.includes("missing required clips")));
});
