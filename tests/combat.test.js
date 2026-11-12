import test from "node:test";
import assert from "node:assert/strict";
import { CombatSystem } from "../src/game/combat.js";

function makeElement() { return { textContent: "", style: { width: "" } }; }
function makeArena() {
  return {
    time: 0,
    playerHealth: 100,
    rivalHealth: 100,
    player: { root: { position: { distanceTo: () => 2 } } },
    rival: { root: { position: {} }, glowMat: { emissiveIntensity: 1.7 } },
    triggerAttack() {},
    triggerDodge() {}
  };
}

test("basic strike resolves after anticipation, not on button press", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  const combat = new CombatSystem(arena);
  combat.perform("attack");
  assert.equal(arena.rivalHealth, 100, "attack should not deal instant damage");
  combat.update(.13, .13);
  assert.equal(arena.rivalHealth, 91, "attack should resolve at its active timing");
  combat.update(.18, .31);
  assert.equal(arena.rivalHealth, 91, "one attack must not resolve more than once");
});

test("dodge creates a short invulnerability window and invokes movement", t => {
  const oldDocument = globalThis.document;
  globalThis.document = { querySelector: () => makeElement() };
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  let dodges = 0;
  arena.triggerDodge = () => { dodges++; };
  const combat = new CombatSystem(arena);
  combat.perform("dodge");
  assert.equal(dodges, 1);
  assert.equal(combat.invulnerableUntil, .48);
});
