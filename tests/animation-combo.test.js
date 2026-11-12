import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { AnimationStateController } from "../src/game/animation.js";

function makeClip(name) {
  return new THREE.AnimationClip(name, 0.8, [
    new THREE.NumberKeyframeTrack(".position[x]", [0, 0.8], [0, 0.1])
  ]);
}

test("movement updates do not interrupt combo follow-up animations", () => {
  const model = new THREE.Group();
  const controller = new AnimationStateController(model, [
    makeClip("idle"), makeClip("run"), makeClip("attack2"), makeClip("attack3")
  ]);
  controller.play("attack2");
  controller.setLocomotion(true);
  assert.equal(controller.state, "attack2");
  controller.play("attack3");
  controller.setLocomotion(false);
  assert.equal(controller.state, "attack3");
  controller.destroy();
});

test("locomotion resumes after a combo finisher completes", () => {
  const model = new THREE.Group();
  const controller = new AnimationStateController(model, [
    makeClip("idle"), makeClip("run"), makeClip("attack3")
  ]);
  controller.setLocomotion(true);
  controller.play("attack3");
  for (let frame = 0; frame < 20; frame++) controller.update(0.05);
  assert.equal(controller.state, "locomotion");
  controller.destroy();
});
