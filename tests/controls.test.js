import test from "node:test";
import assert from "node:assert/strict";
import { TouchControls } from "../src/game/controls.js";

class FakeElement {
  constructor(rect = { left: 0, top: 0, width: 100, height: 100 }) {
    this.rect = rect;
    this.listeners = new Map();
    this.style = {};
    this.dataset = {};
    this.classList = { add() {}, remove() {} };
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  removeEventListener(type, fn) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter(x => x !== fn));
  }
  dispatch(type, event) {
    for (const fn of this.listeners.get(type) || []) fn(event);
  }
  getBoundingClientRect() { return this.rect; }
  setPointerCapture() {}
}

function pointer(extra = {}) {
  return { pointerId: 1, clientX: 50, clientY: 50, preventDefault() {}, ...extra };
}

test("movement pad normalizes thumb input and returns to neutral on release", () => {
  const pad = new FakeElement();
  const knob = new FakeElement();
  const actions = new FakeElement();
  const moves = [];
  const controls = new TouchControls({ pad, knob, actions, onMove: (x,y) => moves.push([x,y]), onAction() {} });
  pad.dispatch("pointerdown", pointer({ clientX: 79, clientY: 50 }));
  assert.ok(Math.abs(moves.at(-1)[0] - 1) < 1e-8);
  assert.ok(Math.abs(moves.at(-1)[1]) < 1e-8);
  pad.dispatch("pointerup", pointer());
  assert.deepEqual(moves.at(-1), [0,0]);
  controls.destroy();
});

test("movement pointer does not block an independent combat pointer", () => {
  const pad = new FakeElement();
  const knob = new FakeElement();
  const actions = new FakeElement();
  const calls = [];
  const controls = new TouchControls({ pad, knob, actions, onMove() {}, onAction: a => calls.push(a) });
  const button = new FakeElement();
  button.dataset.action = "attack";
  button.closest = () => button;
  pad.dispatch("pointerdown", pointer({ pointerId: 11, clientX: 70 }));
  actions.dispatch("pointerdown", { ...pointer({ pointerId: 22, target: button }), target: button });
  assert.deepEqual(calls, ["attack"]);
  pad.dispatch("pointerup", pointer({ pointerId: 11 }));
  assert.equal(button.dataset.held, "1");
  actions.dispatch("pointerup", { ...pointer({ pointerId: 22, target: button }), target: button });
  assert.equal(button.dataset.held, "0");
  controls.destroy();
});

test("destroy removes pointer listeners", () => {
  const pad = new FakeElement();
  const knob = new FakeElement();
  const actions = new FakeElement();
  const controls = new TouchControls({ pad, knob, actions, onMove() {}, onAction() {} });
  controls.destroy();
  assert.equal((pad.listeners.get("pointerdown") || []).length, 0);
  assert.equal((actions.listeners.get("pointerdown") || []).length, 0);
});


test("movement pad filters thumb drift with a small radial dead zone", () => {
  const pad = new FakeElement();
  const knob = new FakeElement();
  const actions = new FakeElement();
  const moves = [];
  const controls = new TouchControls({ pad, knob, actions, onMove: (x,y) => moves.push([x,y]), onAction() {} });
  pad.dispatch("pointerdown", pointer({ clientX: 52, clientY: 50 }));
  assert.deepEqual(moves.at(-1), [0, 0], "tiny resting-thumb movement should not drift the champion");
  pad.dispatch("pointermove", pointer({ clientX: 64, clientY: 50 }));
  const expected = ((14 / 29) - .12) / .88;
  assert.ok(Math.abs(moves.at(-1)[0] - expected) < 1e-8, "analog response should ramp smoothly outside the dead zone");
  assert.equal(moves.at(-1)[1], 0);
  controls.destroy();
});
