import { hasAnimationClip } from "./animation.js";

const MAGIC = 0x46546c67; // "glTF" in little-endian
const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

function fail(message) {
  throw new Error(`Invalid GLB: ${message}`);
}

/** Parse the JSON document from a binary glTF 2.0 container. */
export function readGlbDocument(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.byteLength < 20) fail("file is shorter than the GLB header and JSON chunk header");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint32(0, true) !== MAGIC) fail("bad magic");
  if (view.getUint32(4, true) !== 2) fail("version must be 2");
  if (view.getUint32(8, true) !== bytes.byteLength) fail("declared total length does not match file length");

  let offset = 12;
  let document = null;
  let chunkIndex = 0;
  while (offset < bytes.byteLength) {
    if (offset + 8 > bytes.byteLength) fail("truncated chunk header");
    const length = view.getUint32(offset, true);
    const type = view.getUint32(offset + 4, true);
    offset += 8;
    if (length % 4 !== 0) fail("chunk length is not 4-byte aligned");
    if (offset + length > bytes.byteLength) fail("chunk extends beyond file length");
    if (chunkIndex === 0 && type !== JSON_CHUNK) fail("first chunk must be JSON");
    if (type === JSON_CHUNK) {
      if (document) fail("multiple JSON chunks");
      try {
        const text = new TextDecoder().decode(bytes.subarray(offset, offset + length)).replace(/[\\u0000\\u0020]+$/g, "");
        document = JSON.parse(text);
      } catch (error) {
        fail(`JSON chunk cannot be parsed (${error.message})`);
      }
    }
    if (type !== JSON_CHUNK && type !== BIN_CHUNK) fail("unknown chunk type");
    offset += length;
    chunkIndex += 1;
  }
  if (offset !== bytes.byteLength) fail("chunk alignment does not end at file boundary");
  if (!document) fail("missing JSON document");
  return document;
}

/** Validate the minimum structural contract for a production champion GLB. */
export function inspectCharacterGlb(input, requiredClips = []) {
  const document = readGlbDocument(input);
  const problems = [];
  if (!Array.isArray(document.nodes) || document.nodes.length === 0) problems.push("no nodes");
  if (!Array.isArray(document.meshes) || document.meshes.length === 0) problems.push("no meshes");
  if (!Array.isArray(document.skins) || document.skins.length === 0) problems.push("no skin/armature");
  if (!Array.isArray(document.animations) || document.animations.length === 0) problems.push("no animation clips");
  if (!Array.isArray(document.materials) || document.materials.length === 0) problems.push("no materials");
  for (const [index, skin] of (document.skins || []).entries()) {
    if (!Array.isArray(skin.joints) || skin.joints.length === 0) problems.push(`skin ${index} has no joints`);
  }
  for (const [index, mesh] of (document.meshes || []).entries()) {
    if (!Array.isArray(mesh.primitives) || mesh.primitives.length === 0) problems.push(`mesh ${index} has no primitives`);
  }
  for (const [index, animation] of (document.animations || []).entries()) {
    if (!animation.name) problems.push(`animation ${index} has no name`);
    if (!Array.isArray(animation.channels) || animation.channels.length === 0) problems.push(`animation ${index} has no channels`);
    if (!Array.isArray(animation.samplers) || animation.samplers.length === 0) problems.push(`animation ${index} has no samplers`);
  }
  const missingClips = requiredClips.filter(name => !hasAnimationClip(name, document.animations || []));
  if (missingClips.length) problems.push(`missing required clips: ${missingClips.join(", ")}`);
  return { valid: problems.length === 0, problems, document };
}
