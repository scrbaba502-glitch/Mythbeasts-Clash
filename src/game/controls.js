export class TouchControls {
  constructor({ pad, knob, actions, onMove, onAction }) {
    this.pad = pad;
    this.knob = knob;
    this.actions = actions;
    this.onMove = onMove;
    this.onAction = onAction;
    this.padPointer = null;
    this.cooldownTimers = new Map();
    this.handlePadDown = (e) => {
      if (this.padPointer !== null) return;
      e.preventDefault();
      this.padPointer = e.pointerId;
      this.pad.setPointerCapture(e.pointerId);
      this.updatePad(e);
    };
    this.handlePadMove = (e) => { if (e.pointerId === this.padPointer) this.updatePad(e); };
    this.handlePadEnd = (e) => { if (e.pointerId === this.padPointer) this.resetPad(); };
    this.handleAction = (e) => {
      const button = e.target.closest("button[data-action]");
      if (!button || button.disabled) return;
      e.preventDefault();
      const action = button.dataset.action;
      if (action === "camera") { this.onAction(action); return; }
      if (button.dataset.held === "1") return;
      button.dataset.held = "1";
      this.onAction(action);
      button.classList.add("pressed");
      button.setPointerCapture?.(e.pointerId);
    };
    this.handleActionEnd = (e) => {
      const button = e.target.closest("button[data-action]");
      if (!button) return;
      button.dataset.held = "0";
      button.classList.remove("pressed");
    };
    pad.addEventListener("pointerdown", this.handlePadDown);
    pad.addEventListener("pointermove", this.handlePadMove);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) pad.addEventListener(type, this.handlePadEnd);
    actions.addEventListener("pointerdown", this.handleAction);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) actions.addEventListener(type, this.handleActionEnd);
  }

  updatePad(e) {
    const rect = this.pad.getBoundingClientRect();
    const limit = rect.width * .29;
    const rawX = e.clientX - (rect.left + rect.width / 2);
    const rawY = e.clientY - (rect.top + rect.height / 2);
    const length = Math.hypot(rawX, rawY);
    const scale = length > limit ? limit / length : 1;
    const x = rawX * scale;
    const y = rawY * scale;
    this.knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    this.onMove(x / limit, y / limit);
  }

  resetPad() {
    this.padPointer = null;
    this.knob.style.transform = "translate(-50%, -50%)";
    this.onMove(0, 0);
  }

  destroy() {
    this.resetPad();
    this.pad.removeEventListener("pointerdown", this.handlePadDown);
    this.pad.removeEventListener("pointermove", this.handlePadMove);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) this.pad.removeEventListener(type, this.handlePadEnd);
    this.actions.removeEventListener("pointerdown", this.handleAction);
    for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) this.actions.removeEventListener(type, this.handleActionEnd);
  }
}