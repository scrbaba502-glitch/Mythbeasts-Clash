import * as THREE from "three";

const CLIP_ALIASES = {
  idle: ["idle", "breathing", "stand"],
  locomotion: ["run", "walk", "locomotion", "move"],
  attack: ["attack", "lightattack", "strike"],\n  attack2: ["attack2", "combo2", "heavyattack"],\n  attack3: ["attack3", "combo3", "finisher"],
  dodge: ["dodge", "roll", "dash"],
  hit: ["hit", "hitreact", "damage"],
  stagger: ["stagger", "stun"],
  skill: ["skill", "special", "ability"],
  victory: ["victory", "win"],
  defeat: ["defeat", "death", "lose"],
  bossWindup: ["windup", "telegraph", "charge"]
};

const ONE_SHOT = new Set(["attack", "attack2", "attack3", "dodge", "hit", "stagger", "skill", "victory", "defeat", "bossWindup"]);
const normalize = value => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export class AnimationStateController {
  constructor(model, clips = [], { fadeSeconds = .12, onStateChange = null } = {}) {
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.fadeSeconds = fadeSeconds;
    this.onStateChange = onStateChange;
    this.actions = new Map();
    this.actionDurations = new Map();
    this.state = null;
    this.stateElapsed = 0;
    this.moving = false;
    this.destroyed = false;
    this.finished = event => {
      if (event.action === this.currentAction && ONE_SHOT.has(this.state) &&
          this.state !== "victory" && this.state !== "defeat") {
        this.play(this.moving ? "locomotion" : "idle");
      }
    };
    this.mixer.addEventListener("finished", this.finished);

    for (const [state, aliases] of Object.entries(CLIP_ALIASES)) {
      const clip = clips.find(candidate => {
        const name = normalize(candidate.name);
        return aliases.some(alias => name === normalize(alias));
      });
      if (!clip) continue;
      const action = this.mixer.clipAction(clip);
      action.enabled = true;
      action.clampWhenFinished = ONE_SHOT.has(state);
      action.setLoop(ONE_SHOT.has(state) ? THREE.LoopOnce : THREE.LoopRepeat, ONE_SHOT.has(state) ? 1 : Infinity);
      this.actions.set(state, action);
      this.actionDurations.set(state, clip.duration);
    }
    this.currentAction = null;
    this.play("idle");
  }

  has(state) { return this.actions.has(state); }

  play(state, { force = false, fadeSeconds = this.fadeSeconds } = {}) {
    if (this.destroyed || !this.actions.has(state)) return false;
    if (!force && this.state === state && this.currentAction?.isRunning()) return true;
    const next = this.actions.get(state);
    const previous = this.currentAction;
    next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).play();
    if (previous && previous !== next) next.crossFadeFrom(previous, Math.max(0, fadeSeconds), false);
    else next.fadeIn(Math.max(0, fadeSeconds));
    this.currentAction = next;
    this.state = state;
    this.stateElapsed = 0;
    this.onStateChange?.(state);
    return true;
  }

  setLocomotion(moving) {
    this.moving = Boolean(moving);
    if (this.state === "attack" || this.state === "dodge" || this.state === "hit" ||
        this.state === "stagger" || this.state === "skill" || this.state === "victory" ||
        this.state === "defeat" || this.state === "bossWindup") return;
    this.play(this.moving ? "locomotion" : "idle");
  }

  update(dt) {
    if (this.destroyed) return;
    const delta = Math.max(0, Math.min(dt, .05));
    this.mixer.update(delta);
    if (ONE_SHOT.has(this.state) && this.state !== "victory" && this.state !== "defeat") {
      this.stateElapsed += delta;
      if (this.stateElapsed >= (this.actionDurations.get(this.state) || Infinity)) {
        this.play(this.moving ? "locomotion" : "idle");
      }
    }
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.mixer.removeEventListener("finished", this.finished);
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.model);
    this.actions.clear();
    this.actionDurations.clear();
    this.currentAction = null;
  }
}
