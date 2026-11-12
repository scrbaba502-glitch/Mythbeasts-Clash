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
    triggerDodge() {},
    triggerRivalHit() {},
    triggerPlayerHit() {},
    setMoveInput() {}
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
  assert.equal(combat.invulnerableUntil, .66, "dodge should cover the full boss telegraph impact window");
});

test("boss hit reaction is triggered when player damage lands", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  let hitReactions = 0;
  arena.triggerRivalHit = () => { hitReactions++; };
  const combat = new CombatSystem(arena);
  combat.damageRival(12);
  assert.equal(arena.rivalHealth, 88);
  assert.equal(hitReactions, 1);
});


test("melee strike must face the rival to confirm a hit", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  arena.isPlayerFacingRival = () => false;
  const combat = new CombatSystem(arena);
  combat.perform("attack");
  combat.update(.13, .13);
  assert.equal(arena.rivalHealth, 100, "a melee strike from the wrong direction must not hit");
  assert.match(elements.get("#battle-message").textContent, /WRONG DIRECTION/);
});


test("boss waits for engagement range before starting a telegraphed attack", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  arena.player.root.position.distanceTo = () => 10;
  let windups = 0;
  arena.triggerRivalAttack = () => { windups++; };
  const combat = new CombatSystem(arena);
  combat.update(.016, 3);
  assert.equal(windups, 0, "boss should not telegraph from outside engagement range");
  assert.equal(combat.bossAttackAt, 3.35);
});


test("Atrox enters a faster second phase at half health", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  arena.rivalHealth = 55;
  arena.rivalPhase = 1;
  const combat = new CombatSystem(arena);
  combat.damageRival(10);
  assert.equal(arena.rivalHealth, 45);
  assert.equal(arena.rivalPhase, 2);
  assert.equal(elements.get("#phase-label").textContent, "ATROX · ABYSS UNBOUND");
});


test("combat actions respect commitment windows and cannot overlap", t => {
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
  combat.perform("skill");
  assert.equal(combat.pendingSkill, null, "skill must not interrupt an attack commitment");
  assert.equal(combat.cooldowns.skill, 0, "rejected action must not consume its cooldown");
  assert.ok(combat.actionLockUntil > arena.time);
});

test("boss hit applies a short stun that blocks immediate counter-actions", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  arena.triggerRivalStrike = () => {};
  const combat = new CombatSystem(arena);
  combat.bossAttackAt = 0;
  combat.update(.016, 3);
  combat.update(.63, 3.63);
  assert.equal(arena.playerHealth, 88);
  assert.equal(combat.playerStunnedUntil, 4.01);
  combat.perform("attack");
  assert.equal(combat.pendingAttack, null, "stun must prevent an immediate counterattack");
});


test("Atrox phase two alternates into a larger, heavier abyss slam", t => {
  const oldDocument = globalThis.document;
  const elements = new Map();
  globalThis.document = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, makeElement());
    return elements.get(selector);
  }};
  t.after(() => { if (oldDocument === undefined) delete globalThis.document; else globalThis.document = oldDocument; });

  const arena = makeArena();
  arena.rivalHealth = 40;
  let marker = null;
  arena.setBossTelegraph = (active, radius) => { marker = { active, radius }; };
  arena.triggerRivalStrike = () => {};
  const combat = new CombatSystem(arena);
  combat.bossAttackAt = 0;
  combat.bossAttackCount = 1;
  combat.update(.016, 3);
  assert.equal(combat.telegraphKind, "slam");
  assert.deepEqual(marker, { active: true, radius: 5.35 });
  combat.update(.85, 3.85);
  assert.equal(arena.playerHealth, 76, "abyss slam should deal 24 damage when not dodged");
  assert.deepEqual(marker, { active: false, radius: 5.35 });
});
