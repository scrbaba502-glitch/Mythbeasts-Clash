import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { AnimationStateController } from "../src/game/animation.js";

function clip(name, duration = .2) {
  return new THREE.AnimationClip(name, duration, [
    new THREE.NumberKeyframeTrack(".position[x]", [0, duration], [0, 1])
  ]);
}

test("animation controller maps authored clip names and crossfades locomotion", () => {
  const model = new THREE.Group();
  const controller = new AnimationStateController(model, [
    clip("Idle"), clip("Run"), clip("Light_Attack"), clip("Dodge"), clip("HitReact")
  ]);
  assert.equal(controller.has("idle"), true);
  assert.equal(controller.has("locomotion"), true);
  assert.equal(controller.has("attack"), true);
  assert.equal(controller.play("attack"), true);
  assert.equal(controller.state, "attack");
  controller.setLocomotion(true);
  assert.equal(controller.state, "attack", "locomotion must not interrupt a committed action");
  for (let frame = 0; frame < 5; frame++) controller.update(.05);
  assert.equal(controller.state, "locomotion", "finished one-shot should return to locomotion");
  controller.destroy();
  assert.equal(controller.destroyed, true);
});

test("missing authored clips fail safely without throwing", () => {
  const model = new THREE.Group();
  const controller = new AnimationStateController(model, [clip("Idle")]);
  assert.equal(controller.play("ultimate"), false);
  assert.equal(controller.has("attack"), false);
  controller.destroy();
});
